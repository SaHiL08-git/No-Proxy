'use client';
import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react'; // Correct usage of QRCodeSVG

const TeacherDashboard = () => {
  const [className, setClassName] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [sessionTime, setSessionTime] = useState('');
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [errorMessage, setErrorMessage] = useState('');
  const [qrValue, setQrValue] = useState('');
  const [currentDateTime, setCurrentDateTime] = useState('');

  // Automatically fetch location when requested
  const handleUseLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setErrorMessage(''); // Clear error message if location is set
        },
        (error) => {
          setErrorMessage('Unable to fetch location. Please enable location services.');
        }
      );
    } else {
      setErrorMessage('Geolocation is not supported by this browser.');
    }
  };

  // Generate QR Code
  const handleGenerateQr = () => {
    if (!className || !subjectName || !sessionTime || !location.latitude || !location.longitude) {
      setErrorMessage('Please fill in all fields and ensure location is set.');
      return;
    }

    setErrorMessage('');
    const qrData = {
      className,
      subjectName,
      sessionTime,
      location,
      timestamp: new Date().toISOString(), // Include current date and time in QR data
    };
    setQrValue(JSON.stringify(qrData));
  };

  // Update current date and time dynamically
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentDateTime(now.toLocaleString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white p-8 animate-fadeIn">
      <h1 className="text-4xl font-bold text-center mb-6">Teacher Dashboard</h1>
      <div className="max-w-lg mx-auto bg-white text-black p-6 rounded-lg shadow-lg animate-slideInUp">
        <label className="block mb-2 font-medium">Class Name:</label>
        <input
          type="text"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          placeholder="Enter Class Name"
          className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <label className="block mb-2 font-medium">Subject Name:</label>
        <input
          type="text"
          value={subjectName}
          onChange={(e) => setSubjectName(e.target.value)}
          placeholder="Enter Subject Name"
          className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <label className="block mb-2 font-medium">Session Time (in minutes):</label>
        <input
          type="number"
          value={sessionTime}
          onChange={(e) => {
            const value = e.target.value;
            setSessionTime(value >= 0 ? value : ''); // Prevent negative or invalid values
          }}
          placeholder="Enter Time"
          className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleUseLocation}
          className="w-full mb-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Use My Location
        </button>

        <div className="text-sm mb-4">
          {location.latitude && location.longitude ? (
            <p>
              Location: {location.latitude}, {location.longitude}
            </p>
          ) : (
            <p className="text-red-500">{errorMessage || 'Location not set.'}</p>
          )}
        </div>

        <button
          onClick={handleGenerateQr}
          className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Generate QR Code
        </button>

        <div className="mt-6">
          {qrValue ? (
            <>
              <h2 className="text-center font-bold mb-4">QR Code</h2>
              <div className="flex justify-center">
                <QRCodeSVG value={qrValue} size={200} includeMargin />
              </div>
              <div className="mt-4 text-center text-sm">
                <p>
                  <strong>Class:</strong> {className} | <strong>Subject:</strong> {subjectName}
                </p>
                <p>
                  <strong>Time:</strong> {sessionTime} minutes | <strong>Date:</strong>{' '}
                  {currentDateTime}
                </p>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-600">QR Code will appear here after generation.</p>
          )}
        </div>
      </div>

      <footer className="mt-8 text-center">
        <p>Current Date & Time: {currentDateTime}</p>
      </footer>
    </div>
  );
};

export default TeacherDashboard;
