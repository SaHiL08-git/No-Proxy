'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentDashboard = () => {
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [scannedQR, setScannedQR] = useState(''); // State to hold scanned QR
  const [remainingTime, setRemainingTime] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSessionActive, setIsSessionActive] = useState(false);

  useEffect(() => {
    const fetchSessionDetails = async () => {
      try {
        const response = await axios.get('http://localhost:3001/session-details');
        if (response.status === 200 && response.data.isActive) {
          setIsSessionActive(true);
          setQrCode(response.data.qrCode);
          setRemainingTime(response.data.remainingTime);
        } else {
          setIsSessionActive(false);
        }
      } catch (error) {
        console.error('Error fetching session details:', error);
        setErrorMessage('Failed to load session details. Please try again.');
      }
    };

    fetchSessionDetails();
  }, []);

  const handleMarkAttendance = async () => {
    if (!name || !rollNumber || !scannedQR || !latitude || !longitude) {
      setErrorMessage('Please fill in all fields, scan the QR code, and allow location access.');
      return;
    }

    try {
      const payload = {
        studentName: name,
        rollNo: rollNumber,
        qrCode: scannedQR,
        location: `${latitude},${longitude}`,
      };

      const response = await axios.post('http://localhost:3001/attendance', payload);

      if (response.status === 200) {
        setSuccessMessage('Attendance marked successfully!');
        setErrorMessage('');
      }
    } catch (error) {
      console.error('Error marking attendance:', error);
      setErrorMessage('Failed to mark attendance. Please try again.');
    }
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setErrorMessage('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toFixed(6));
        setLongitude(position.coords.longitude.toFixed(6));
        setErrorMessage('');
      },
      (error) => {
        console.error('Error getting location:', error);
        setErrorMessage('Failed to get location. Please try again.');
      }
    );
  };

  const handleScanQR = () => {
    if (qrCode) {
      setScannedQR(qrCode); // Simulates scanning the QR by directly using the `qrCode` value
      setSuccessMessage('QR Code scanned successfully!');
    } else {
      setErrorMessage('QR Code is not available to scan.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
      <h1 className="text-5xl font-bold mb-8">📚 Student Dashboard</h1>

      {isSessionActive ? (
        <div className="bg-white text-black p-8 rounded-lg shadow-xl w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-6 text-center">Mark Attendance</h2>

          <label className="block mb-4">
            <span className="font-medium">Name:</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full p-3 border rounded-lg mt-1"
            />
          </label>

          <label className="block mb-4">
            <span className="font-medium">Roll Number:</span>
            <input
              type="text"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              placeholder="Enter your roll number"
              className="w-full p-3 border rounded-lg mt-1"
            />
          </label>

          <div className="mt-4">
            <button
              onClick={handleUseMyLocation}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full"
            >
              Use Current Location
            </button>
            {latitude && longitude && (
              <p className="mt-2 text-green-600">
                Location: Lat {latitude}, Lon {longitude}
              </p>
            )}
          </div>

          <div className="mt-4 text-center">
            <h3 className="text-lg font-medium mb-2">QR Code:</h3>
            {qrCode ? (
              <>
                <img src={qrCode} alt="QR Code" className="inline-block w-32 h-32" />
                <button
                  onClick={handleScanQR}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4"
                >
                  Scan QR
                </button>
              </>
            ) : (
              <p className="text-red-500">QR Code not available yet.</p>
            )}
          </div>

          <button
            onClick={handleMarkAttendance}
            className="bg-green-500 text-white px-4 py-2 rounded-lg mt-6 w-full"
          >
            Mark Attendance
          </button>

          {remainingTime && (
            <p className="mt-4 text-yellow-500 text-center">
              ⏳ Session Time Left: {remainingTime}
            </p>
          )}

          {errorMessage && <p className="mt-4 text-red-500 text-center">{errorMessage}</p>}
          {successMessage && <p className="mt-4 text-green-500 text-center">{successMessage}</p>}
        </div>
      ) : (
        <div className="bg-white text-black p-8 rounded-lg shadow-xl w-full max-w-md text-center">
          <h2 className="text-2xl font-semibold mb-6">No Active Session</h2>
          <p className="text-gray-600">Please wait for the teacher to create a session.</p>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
