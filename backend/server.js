// server.js
const express = require("express");
const cors = require("cors");
const app = express();

// Allow requests from your React frontend
app.use(cors());

// Load the pubs JSON data
const pubs = require("./pubs.json");

// Define an endpoint to get pubs
app.get("/api/pubs", (req, res) => {
  res.json(pubs);
});

// Start the server
const PORT = 3001; // or any port you prefer
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
