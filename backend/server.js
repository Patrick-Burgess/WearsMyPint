// server.js
require("dotenv").config();
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

// I would like to modularise this but i don't know how ?
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

// This route calls an external api (openrouteservice) and finds the walking path 
// between two pubs.
app.post("/api/pubs/walking-route", async (req, res) => {
  // takes a list of pubs IDs
  const { pubIDs } = req.body;

  if (!pubIDs) {
    return res.status(400).json({ error: "Missing pubIDs." });
  }

  const ids = pubIDs.map(Number)
  
  // Checks if any ID in the provided pubID is an INVALID ID (i.e doesn't exist in pubs.json)
  const missingIds = ids.filter((id) => !pubs.find((p) => p.id === id));

  if (missingIds.length > 0) {
    return res.status(400).json({
      error: `Invalid pub ID(s): ${missingIds.join(", ")}`
    });
  }

  // getes the lng and lat from the pubs
  const coordinates = ids.map((id) => {
    const pub = pubs.find((p) => p.id === id);
    return [pub.lng, pub.lat]; 
  });


  try {
    //apiKey for openrouteservice (uses .env for security)
    const apiKey = process.env.ROUTE_API_KEY;


    if (!apiKey) {
      return res.status(500).json({ error: "Missing routing API key." });
    }

    const url = `https://api.openrouteservice.org/v2/directions/foot-walking`;

    // posts a list of coordinates to foot-walking api
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ coordinates }),
    });
    const data = await response.json();
    
    // console.log(data)
    res.json(data);
  } catch (error) {
    console.error("Error fetching external route:", error);
    res.status(500).json({ error: "Failed to fetch route." });
  }

});

// Start the server
const PORT = 3001; // or any port you prefer
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

