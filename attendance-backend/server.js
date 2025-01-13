const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Store session details in memory (for simplicity)
let sessionDetails = null;

// Default route for the root path
app.get("/", (req, res) => {
    res.send("Backend is working fine!");
});

// Endpoint to handle attendance
app.post("/attendance", (req, res) => {
    const { name, location } = req.body;

    if (!name || !location) {
        return res.status(400).json({ error: "Name or location missing!" });
    }

    console.log("Attendance Marked:", name);
    console.log("Location:", location);
    res.status(200).json({ message: "Attendance marked successfully." });
});

// Endpoint to handle session creation
app.post("/create-session", (req, res) => {
    const { subject, className, timeLimit, location } = req.body;

    if (!subject || !className || !timeLimit) {
        return res.status(400).json({ error: "Subject, className, or timeLimit missing!" });
    }

    // Save session details in memory
    sessionDetails = {
        subject,
        className,
        qrCode: `QR Code for ${subject} - ${className}`,
        remainingTime: timeLimit * 60, // Convert minutes to seconds
        location: location || "No location provided",
        createdAt: new Date().toISOString(), // Add timestamp
    };

    console.log("Session Created:", sessionDetails);

    res.status(200).json({
        message: "Session created successfully.",
        qrCode: sessionDetails.qrCode,
    });
});

// Endpoint to fetch session details
app.get("/session", (req, res) => {
    if (!sessionDetails) {
        return res.status(404).json({ error: "No active session found!" });
    }

    // Calculate remaining time
    const elapsedTime = Math.floor((Date.now() - new Date(sessionDetails.createdAt).getTime()) / 1000);
    const remainingTime = sessionDetails.remainingTime - elapsedTime;

    if (remainingTime <= 0) {
        sessionDetails = null; // Clear session if time is up
        return res.status(404).json({ error: "Session has expired!" });
    }

    res.status(200).json({
        qrCode: sessionDetails.qrCode,
        remainingTime,
        subject: sessionDetails.subject,
        className: sessionDetails.className,
        location: sessionDetails.location,
    });
});

// Default route for errors
app.use((req, res) => {
    res.status(404).json({ error: "Route not found!" });
});

// Start server
app.listen(PORT, () => {
    console.log(`Backend is running on http://localhost:${PORT}`);
});
