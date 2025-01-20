const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    studentName: String,
    rollNo: String,
    qrCode: String,
    location: String,
    timestamp: Date,
  },
  {
    timeseries: {
      timeField: 'timestamp',
      metaField: 'metadata',
      granularity: 'seconds', // Optional field for granularity
    },
    versionKey: false, // Optional, removes the __v field
  }
);

module.exports = mongoose.model('Attendance', attendanceSchema);
