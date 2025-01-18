const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const qrcode = require('qrcode');

const app = express();
app.use(bodyParser.json());
app.use(cors());

let currentSession = null;
let sessionTimer = null;
let remainingTime = 0;

app.get('/', (req, res) => {
  res.status(200).send('Server is running!');
});

app.post('/create-session', async (req, res) => {
  const { subject, className, timeLimit, location } = req.body;

  console.log('Request received:', { subject, className, timeLimit, location });

  if (!subject || !className || typeof timeLimit !== 'number' || !location) {
    return res.status(400).json({
      error: 'Invalid input: Ensure subject, className, timeLimit (number), and location are provided.',
    });
  }

  try {
    const qrData = `Session for ${subject} (${className}) at ${location}`;
    const qrCode = await qrcode.toDataURL(qrData);

    currentSession = {
      subject,
      className,
      timeLimit,
      location,
      qrCode,
      startTime: new Date(),
    };

    remainingTime = timeLimit * 60;

    if (sessionTimer) clearInterval(sessionTimer);
    sessionTimer = setInterval(() => {
      remainingTime -= 1;
      if (remainingTime <= 0) {
        clearInterval(sessionTimer);
        sessionTimer = null;
        currentSession = null;
      }
    }, 1000);

    res.status(200).json({
      message: 'Session created successfully!',
      qrCode,
    });
  } catch (error) {
    console.error('Error in /create-session:', error);
    res.status(500).json({ error: 'Failed to create session.', details: error.message });
  }
});

app.get('/session-details', (req, res) => {
  if (!currentSession) {
    return res.status(200).json({
      isActive: false, // Indicates no active session
    });
  }

  const minutesLeft = Math.floor(remainingTime / 60);
  const secondsLeft = remainingTime % 60;

  res.status(200).json({
    isActive: true, // Indicates an active session
    qrCode: currentSession.qrCode,
    subject: currentSession.subject,
    className: currentSession.className,
    remainingTime: `${minutesLeft}:${secondsLeft.toString().padStart(2, '0')}`,
  });
});

app.post('/attendance', (req, res) => {
  const { studentName, rollNo, qrCode, location } = req.body;

  if (!studentName || !rollNo || !qrCode || !location) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  if (!currentSession) {
    return res.status(404).json({ error: 'No active session found.' });
  }

  const expectedQrData = `Session for ${currentSession.subject} (${currentSession.className}) at ${currentSession.location}`;
  if (qrCode !== expectedQrData) {
    return res.status(400).json({ error: 'Invalid QR code scanned.' });
  }

  if (location !== currentSession.location) {
    return res.status(400).json({ error: 'Your location does not match the session location.' });
  }

  console.log(`Attendance marked for ${studentName} (${rollNo})`);
  res.status(200).json({ message: 'Attendance marked successfully.' });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
