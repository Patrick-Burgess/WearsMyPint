import React, { useEffect, useState } from "react";

function PubRoutingForm({ pubs, route, setRoute }) {
  const [startPubID, setStartPubID] = useState("");
  const [endPubID, setEndPubID] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // gets the TSP route from the python file based on start and end pub
    // returns a list of pub ids in the most efficient order
    // would need some big rework to add filters and stuff
    fetch("http://localhost:3001/api/pubs/route", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        startPubID: startPubID,
        endPubID: endPubID,
      }),
    })
      .then((res) => res.json())
      .then((data) => setRoute(data.route))
      .catch((err) => console.error("Error getting route:", err));

  };

  // fullRoute just takes the ids and provides context to them 
  // e.g. matches the id to the pub.json data
  const fullRoute = route.map((id) => pubs.find((pub) => pub.id === id));

  return (
    <div>
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="mb-3">
        <label htmlFor="fromSelect" className="form-label">From:</label>
        <select
          id="fromSelect"
          className="form-select"
          value={startPubID}
          onChange={(e) => setStartPubID(e.target.value)}
          required
        >
          <option value="" disabled>
            Select starting pub
          </option>
          {pubs.map((pub) => (
            <option key={pub.id} value={pub.id}>
              {pub.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="toSelect" className="form-label">To:</label>
        <select
          id="toSelect"
          className="form-select"
          value={endPubID}
          onChange={(e) => setEndPubID(e.target.value)}
          required
        >
          <option value="" disabled>
            Select destination pub
          </option>
          {pubs.map((pub) => (
            <option key={pub.id} value={pub.id}>
              {pub.name}
            </option>
          ))}
        </select>
      </div>

      <button className="btn btn-primary" type="submit">
        Get Route
      </button>
    </form>


    <br >
    </br>

    <ol>
        {fullRoute.map((pub) => <li key={pub.id}>{pub.name}</li>)}
    </ol>
    </div>
    
  );
}

export default PubRoutingForm;


