const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const QRCode = require('qrcode');
const connectDB = require('./db');
const Attendance = require('./models/attendance');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
connectDB();

// Default route
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// Session details
let sessionDetails = {
  isActive: false,
  qrCode: '',
  remainingTime: '10:00',
};

// Create session
app.post('/create-session', async (req, res) => {
  try {
    const { duration } = req.body;
    const qrData = `Session-${Date.now()}`;
    const qrCodeImage = await QRCode.toDataURL(qrData);

    sessionDetails = {
      isActive: true,
      qrCode: qrCodeImage,
      remainingTime: `${duration}:00`,
    };

    res.status(200).json({
      message: 'Session created successfully',
      qrCode: qrCodeImage,
    });
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ error: 'Failed to create session.' });
  }
});

// Get session details
app.get('/session-details', (req, res) => {
  if (!sessionDetails.isActive) {
    return res.status(200).json({ isActive: false });
  }

  res.status(200).json({
    isActive: sessionDetails.isActive,
    qrCode: sessionDetails.qrCode,
    remainingTime: sessionDetails.remainingTime,
  });
});

// Mark attendance
app.post('/attendance', async (req, res) => {
  const { studentName, rollNo, qrCode, location } = req.body;

  if (!studentName || !rollNo || !qrCode || !location) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  if (qrCode !== sessionDetails.qrCode) {
    return res.status(400).json({ error: 'Invalid QR code.' });
  }

  const attendanceRecord = new Attendance({ studentName, rollNo, qrCode, location });

  try {
    await attendanceRecord.save();
    res.status(200).json({ message: 'Attendance marked successfully.' });
  } catch (error) {
    console.error('Error marking attendance:', error);
    res.status(500).json({ error: 'Failed to mark attendance.' });
  }
});

// End session
app.post('/end-session', (req, res) => {
  sessionDetails = {
    isActive: false,
    qrCode: '',
    remainingTime: '0:00',
  };

  res.status(200).json({ message: 'Session ended successfully.' });
});

// Start server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
