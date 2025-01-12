"use client";

import React, { useState } from "react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    if (email === "teacher@example.com" && password === "teacher123") {
      window.location.href = "/teacher-dashboard";
    } else if (email === "student@example.com" && password === "student123") {
      window.location.href = "/student-dashboard";
    } else {
      setErrorMessage("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white">
      {/* Quote Section */}
      <div className="absolute top-10 left-1/2 transform -translate-x-1/2 text-center">
        <h1 className="text-4xl font-bold mb-4 animate-fadeIn">
          Welcome to the Attendance Portal
        </h1>
        <p className="text-lg italic animate-fadeInSlow">
          "Consistency is the key to success."
        </p>
      </div>

      {/* Login Form */}
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-sm w-full text-black animate-slideInUp">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Login to Continue
        </h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 text-sm font-large font-bold">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-large font-bold"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition"
              placeholder="Enter your password"
              required
            />
          </div>
          {errorMessage && (
            <p className="text-red-600 text-sm mb-4">{errorMessage}</p>
          )}
          <button
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
          >
            Login
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">
          Trouble logging in?{" "}
          <a href="#" className="text-blue-500 hover:underline">
            Contact Support
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
