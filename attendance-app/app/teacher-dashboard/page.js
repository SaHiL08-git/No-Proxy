'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TeacherDashboard = () => {
  const [classTime, setClassTime] = useState(40); // Default class time in minutes
  const [remainingTime, setRemainingTime] = useState(null);
  const [location, setLocation] = useState('');
  const [qrGenerated, setQrGenerated] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [sessionDetails, setSessionDetails] = useState({
    subject: '',
    className: '',
  });
  const [timerInterval, setTimerInterval] = useState(null);

  // Start the countdown timer
  const startTimer = (minutes) => {
    const totalSeconds = minutes * 60;
    let remainingSeconds = totalSeconds;

    if (timerInterval) {
      clearInterval(timerInterval); // Clear any existing timer
    }

    const interval = setInterval(() => {
      const minutesLeft = Math.floor(remainingSeconds / 60);
      const secondsLeft = remainingSeconds % 60;

      setRemainingTime(`${minutesLeft}:${secondsLeft.toString().padStart(2, '0')}`);
      remainingSeconds -= 1;

      if (remainingSeconds < 0) {
        clearInterval(interval);
        setRemainingTime('Time is up!');
      }
    }, 1000);

    setTimerInterval(interval);
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [timerInterval]);

  const handleCreateSession = async () => {
    if (!sessionDetails.subject || !sessionDetails.className) {
      setErrorMessage('Please fill in all fields before creating a session.');
      return;
    }

    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await axios.post('http://localhost:3001/create-session', {
        subject: sessionDetails.subject,
        className: sessionDetails.className,
        timeLimit: classTime,
        location,
      });

      if (response.status === 200) {
        setSuccessMessage('Session created successfully! QR code is available for students.');
        setQrGenerated(true);
        startTimer(classTime); // Start the countdown timer
      }
    } catch (error) {
      console.error('Error creating session:', error);
      setErrorMessage('Failed to create session. Please try again.');
    }
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setErrorMessage('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation(`Lat: ${latitude.toFixed(6)}, Lon: ${longitude.toFixed(6)}`);
        setErrorMessage('');
      },
      (error) => {
        console.error('Error getting location:', error);
        setErrorMessage('Failed to get location. Please try again.');
      }
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
      <h1 className="text-4xl font-bold mb-6 animate-fadeIn">Teacher Dashboard</h1>

      <div className="bg-white text-black p-6 rounded-lg shadow-lg animate-slideInUp w-96">
        <h2 className="text-xl font-semibold mb-4">Create Class Session</h2>

        <label className="block mb-2">
          Course:
          <input
            type="text"
            value={sessionDetails.subject}
            onChange={(e) =>
              setSessionDetails({ ...sessionDetails, subject: e.target.value })
            }
            placeholder="Enter Course Name"
            className="w-full p-2 border rounded mt-1"
          />
        </label>

        <label className="block mb-2">
          Class Name:
          <input
            type="text"
            value={sessionDetails.className}
            onChange={(e) =>
              setSessionDetails({ ...sessionDetails, className: e.target.value })
            }
            placeholder="Enter Class Name"
            className="w-full p-2 border rounded mt-1"
          />
        </label>

        <label className="block mb-2">
          Class Duration (in minutes):
          <input
            type="number"
            value={classTime}
            onChange={(e) => setClassTime(Number(e.target.value))}
            placeholder="Enter Class Duration"
            className="w-full p-2 border rounded mt-1"
          />
        </label>

        <div className="mt-4">
          <button
            onClick={handleUseMyLocation}
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600 transition"
          >
            Use Current Location
          </button>
          {location && (
            <p className="mt-2 text-green-500">Location: {location}</p>
          )}
        </div>

        <button
          onClick={handleCreateSession}
          className="bg-indigo-500 text-white px-4 py-2 rounded mt-4 hover:bg-indigo-600 transition w-full"
        >
          Create Session
        </button>

        {remainingTime && (
          <p className="mt-4 text-green-500">Remaining Time: {remainingTime}</p>
        )}
        {errorMessage && (
          <p className="mt-4 text-red-500">{errorMessage}</p>
        )}
        {successMessage && (
          <p className="mt-4 text-green-500">{successMessage}</p>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
