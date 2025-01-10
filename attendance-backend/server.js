const express = require("express");
const app = express();
const PORT = 3001;

// Test Route
app.get("/", (req, res) => {
    res.send("Server is running!");
});

// Start the Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
