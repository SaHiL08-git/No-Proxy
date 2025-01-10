'use client';

import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import axios from 'axios';

const AttendancePage = () => {
  const [qrCodeData, setQRCodeData] = useState('');
  const [location, setLocation] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');

  const handleQRCodeChange = (e) => {
    setQRCodeData(e.target.value);
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const handleSubmit = async () => {
    if (!qrCodeData || !location) {
      alert('Please generate QR code and fetch location before submitting.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/attendance', {
        qrCode: qrCodeData,
        location: location,
      });
      setResponseMessage(response.data.message);
    } catch (error) {
      console.error('Error submitting attendance:', error);
      setResponseMessage('Error submitting attendance.');
    }
  };

  return (
    <div>
      <h1>Attendance Management</h1>
      <div>
        <label>Enter Data for QR Code:</label>
        <input type="text" value={qrCodeData} onChange={handleQRCodeChange} />
        <QRCodeSVG value={qrCodeData} />
      </div>
      <div>
        <button onClick={handleGetLocation}>Get Geolocation</button>
        {location && (
          <p>
            Location: Latitude: {location.latitude}, Longitude: {location.longitude}
          </p>
        )}
      </div>
      <div>
        <button onClick={handleSubmit}>Submit Attendance</button>
      </div>
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
};

export default AttendancePage;
