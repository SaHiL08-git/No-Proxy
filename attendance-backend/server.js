const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

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

// Start server
app.listen(PORT, () => {
    console.log(`Backend is running on http://localhost:${PORT}`);
});