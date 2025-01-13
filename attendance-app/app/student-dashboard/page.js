'use client';
import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from "html5-qrcode";

const StudentDashboard = () => {
  const [qrData, setQrData] = useState(null);
  const [name, setName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [remainingTime, setRemainingTime] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Timer logic
  useEffect(() => {
    if (!remainingTime) return;

    const timer = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev === "Time is up!") {
          clearInterval(timer);
          return prev;
        }

        const [minutes, seconds] = prev.split(":").map(Number);
        const totalSeconds = minutes * 60 + seconds - 1;

        if (totalSeconds <= 0) {
          clearInterval(timer);
          return "Time is up!";
        }

        const newMinutes = Math.floor(totalSeconds / 60);
        const newSeconds = totalSeconds % 60;
        return `${newMinutes}:${newSeconds.toString().padStart(2, "0")}`;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [remainingTime]);

  // Fetch session details from backend
  const fetchSessionDetails = async () => {
    try {
      const response = await fetch("http://localhost:3001/session");
      if (response.ok) {
        const data = await response.json();
        setQrData(data.qrCode);
        setRemainingTime(formatTime(data.remainingTime));
      } else {
        setErrorMessage("No active session found!");
      }
    } catch (error) {
      console.error("Error fetching session details:", error);
      setErrorMessage("Failed to fetch session details. Try again later.");
    }
  };

  // Format time from seconds to MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Handle QR Code scanning
  const handleScanQrCode = () => {
    const scanner = new Html5QrcodeScanner("reader", {
      fps: 10,
      qrbox: 250,
    });

    scanner.render(
      (decodedText) => {
        setSuccessMessage(`QR Code scanned: ${decodedText}`);
        scanner.clear(); // Stop scanning
        document.getElementById("reader").remove();
      },
      (error) => {
        console.error("QR Code scan error:", error);
      }
    );
  };

  // Handle attendance submission
  const handleSubmitAttendance = async () => {
    if (!name || !rollNumber || !qrData) {
      setErrorMessage("Please fill in all fields and scan the QR code.");
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch("http://localhost:3001/attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, rollNumber, qrData }),
      });

      if (response.ok) {
        setSuccessMessage("Attendance marked successfully!");
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || "Failed to mark attendance.");
      }
    } catch (error) {
      console.error("Error submitting attendance:", error);
      setErrorMessage("Failed to submit attendance. Try again later.");
    }
  };

  // Fetch session details on load
  useEffect(() => {
    fetchSessionDetails();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-500 to-teal-600 text-white">
      <h1 className="text-4xl font-bold mb-6">Student Dashboard</h1>

      <div className="bg-white text-black p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Mark Attendance</h2>

        <label className="block mb-2">
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full p-2 border rounded mt-1"
          />
        </label>

        <label className="block mb-2">
          Roll Number:
          <input
            type="text"
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value)}
            placeholder="Enter your roll number"
            className="w-full p-2 border rounded mt-1"
          />
        </label>

        {qrData && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Scan the QR Code:</h3>
            <div id="reader" className="w-full"></div>
            <button
              onClick={handleScanQrCode}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-2 hover:bg-blue-600 transition"
            >
              Start Scanning
            </button>
          </div>
        )}

        {remainingTime && (
          <p className="mt-4 text-green-500">Remaining Time: {remainingTime}</p>
        )}
        {errorMessage && <p className="mt-4 text-red-500">{errorMessage}</p>}
        {successMessage && (
          <p className="mt-4 text-green-500">{successMessage}</p>
        )}

        <button
          onClick={handleSubmitAttendance}
          className="bg-indigo-500 text-white px-4 py-2 rounded mt-4 hover:bg-indigo-600 transition"
        >
          Submit Attendance
        </button>
      </div>
    </div>
  );
};

export default StudentDashboard;