"use client";

import React, { useState } from "react";
import axios from "axios";

const Page = () => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const markAttendance = async () => {
    if (!name.trim()) {
      setErrorMessage("Name cannot be empty.");
      return;
    }

    if (!location) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          setErrorMessage("Failed to fetch location. Please allow location access.");
          console.error("Geolocation Error:", error);
        }
      );
      return;
    }

    try {
      const response = await axios.post("http://localhost:3001/attendance", {
        name,
        location,
      });

      if (response.status === 200) {
        setSuccessMessage("Attendance marked successfully!");
        setName("");
        setLocation(null);
        setErrorMessage("");
      }
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
      setErrorMessage("Failed to mark attendance. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex flex-col justify-center items-center">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md animate-fadeIn">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Attendance Management
        </h1>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-blue-950"
          />
          <button
            onClick={markAttendance}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105"
          >
            Mark Attendance
          </button>
        </div>
        {location && (
          <div className="mt-6 text-sm text-gray-600">
            <h3 className="font-medium text-gray-800">Your Location:</h3>
            <p>Latitude: {location.latitude}</p>
            <p>Longitude: {location.longitude}</p>
          </div>
        )}
        {successMessage && (
          <div className="mt-4 text-green-600 font-medium">{successMessage}</div>
        )}
        {errorMessage && (
          <div className="mt-4 text-red-600 font-medium">{errorMessage}</div>
        )}
      </div>
    </div>
  );
};

export default Page;
