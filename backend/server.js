// server.js
const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");
const app = express();


// Allow requests from your React frontend
app.use(cors());

app.use(express.json()); 

// Load the pubs JSON data
const pubs = require("./pubs.json");

// Define an endpoint to get pubs
app.get("/api/pubs", (req, res) => {
  res.json(pubs);
});

// !!!!!! THIS ONLY WORKS FOR SMALL INPUT i.e. < 10 pubs (as its O(n!))
// It also dosen't work if the start and end pub are the same at the moment
app.post("/api/pubs/route", async (req, res) => {
  const { startPubID, endPubID } = req.body;

  if (!startPubID || !endPubID) {
    return res.status(400).json({ error: "Both start and end pub IDs are required." });
  }

  try {
    // Fetches pub data from other api
    const pubResponse = await fetch("http://localhost:3001/api/pubs");
    const pubData = await pubResponse.json();

    // Spawns a new Python process to run the pathfinding algo
    const python = spawn("python3", ["python/pathfindingAlgorithm/bruteForce.py"]);
    let output = "";

    // Listen for data from the Python script via stdout
    python.stdout.on("data", (data) => {
      output += data.toString();
    });

    // If python produces an error it will be printed to the server console
    // Can also be used to debug the python script
    // e.g print('hello world', file=sys.stderr), to print to the server console
    python.stderr.on("data", (err) => {
      console.error("Python error:", err.toString());
    });
  
    python.on("close", () => {
      try {
        const result = JSON.parse(output);
        // IMPLEMENT LOGIC TO RETURN THE DATA TO THE FRONTEND HERE!
        console.log("Python output:", result);
        res.json(result); 
      } catch (err) {
        res.status(500).json({ error: "Failed to parse Python output" });
      }
    });

    
    // Send input arguments to the Python script via stdin
    python.stdin.write(JSON.stringify({ pubData, startPubID, endPubID }));
    python.stdin.end();

  } catch (error) {
    console.error("Error fetching pub data:", error);
    res.status(500).json({ error: "Failed to fetch pub data" });
  }
});

// Start the server
const PORT = 3001; // or any port you prefer
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

