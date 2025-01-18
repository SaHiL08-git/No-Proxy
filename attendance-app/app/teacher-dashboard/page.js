'use client';
import React, { useState } from 'react';
const axios = require('axios');

const TeacherDashboard = () => {
  const [subject, setSubject] = useState(''); // Renamed from 'course' to 'subject'
  const [className, setClassName] = useState('');
  const [timeLimit, setTimeLimit] = useState(''); // Renamed from 'duration' to 'timeLimit'
  const [location, setLocation] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [countdown, setCountdown] = useState(null);

  // Function to get user's current location
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setErrorMessage('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation(`${latitude}, ${longitude}`);
        setErrorMessage('');
      },
      (error) => {
        console.error('Error getting location:', error);
        setErrorMessage('Failed to get location. Please try again.');
      }
    );
  };

  // Function to start the countdown timer
  const startCountdown = (minutes) => {
    let totalSeconds = minutes * 60;

    const interval = setInterval(() => {
      const minutesLeft = Math.floor(totalSeconds / 60);
      const secondsLeft = totalSeconds % 60;
      setCountdown(`${minutesLeft}m ${secondsLeft}s`);

      if (totalSeconds <= 0) {
        clearInterval(interval);
        setCountdown('Session ended.');
      }

      totalSeconds -= 1;
    }, 1000);
  };

  // Function to create a session
  const handleCreateSession = async () => {
    if (!subject || !className || !timeLimit || !location) {
      setErrorMessage('Please fill in all fields before creating a session.');
      return;
    }

    const payload = {
      subject, // Renamed from 'course' to 'subject'
      className,
      timeLimit: parseInt(timeLimit, 10), // Renamed from 'duration' to 'timeLimit'
      location,
    };

    console.log('Payload being sent:', payload);

    try {
      const response = await axios.post('http://localhost:3001/create-session', payload, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 5000, // Timeout in milliseconds
      });

      if (response.status === 200 && response.data.success) {
        setSuccessMessage('Session created successfully!');
        setErrorMessage('');
        setSubject('');
        setClassName('');
        setTimeLimit('');
        setLocation('');
        startCountdown(parseInt(timeLimit, 10)); // Start countdown
      } else {
        setErrorMessage(response.data.message || 'Failed to create session.');
      }
    } catch (error) {
      console.error('Error during API call:', error);

      if (error.response) {
        setErrorMessage(error.response.data.message || 'Error: Failed to create session.');
      } else if (error.request) {
        setErrorMessage('Server not responding. Please try again later.');
      } else {
        setErrorMessage('Unexpected error occurred.');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
      <h1 className="text-5xl font-bold mb-8 animate-fadeIn">🎓 Teacher Dashboard</h1>
      <div className="bg-white text-black p-8 rounded-lg shadow-xl animate-slideInUp w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">Create Class Session</h2>

        <label className="block mb-4">
          <span className="font-medium">Course:</span>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter Course name"
            className="w-full p-3 border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </label>

        <label className="block mb-4">
          <span className="font-medium">Class Name:</span>
          <input
            type="text"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            placeholder="Enter class name"
            className="w-full p-3 border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </label>

        <label className="block mb-4">
          <span className="font-medium">Class Duration (in minutes):</span>
          <input
            type="number"
            value={timeLimit}
            onChange={(e) => setTimeLimit(e.target.value)}
            placeholder="Enter duration"
            className="w-full p-3 border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </label>

        <div className="mt-4">
          <button
            onClick={handleUseMyLocation}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition w-full"
          >
            Use Current Location
          </button>
          {location && <p className="mt-2 text-green-600">Location: {location}</p>}
        </div>

        <button
          onClick={handleCreateSession}
          className="bg-green-500 text-white px-4 py-2 rounded-lg mt-6 hover:bg-green-600 transition w-full"
        >
          Create Session
        </button>

        {successMessage && <p className="mt-4 text-green-600 text-center">{successMessage}</p>}
        {errorMessage && <p className="mt-4 text-red-600 text-center">{errorMessage}</p>}
        {countdown && <p className="mt-4 text-yellow-600 text-center">Time Left: {countdown}</p>}
      </div>
    </div>
  );
};

export default TeacherDashboard;
