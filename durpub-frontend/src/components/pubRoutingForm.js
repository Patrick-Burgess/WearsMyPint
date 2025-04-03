import React, { useEffect, useState } from "react";

function PubRoutingForm({ pubs }) {
  const [startPubID, setStartPubID] = useState("");
  const [endPubID, setEndPubID] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:3001/api/pubs/route", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        startPubID: startPubID,
        endPubID: endPubID,
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log("Route result:", data))
      .catch((err) => console.error("Error getting route:", err));
  };

  return (
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
  );
}

export default PubRoutingForm;


