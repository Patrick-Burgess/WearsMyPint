import React, { useState } from "react";

function PintPricing({ pubs }) {
  const [selectedPubID, setSelectedPubID] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedPub = pubs.find((pub) => pub.id === parseInt(selectedPubID));
    console.log("Selected pub:", selectedPub);
    // Further logic here – e.g., show drink prices or edit form
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 container mt-4">
      <div className="mb-3">
        <label htmlFor="pubSelect" className="form-label">Select Pub:</label>
        <select
          id="pubSelect"
          className="form-select"
          value={selectedPubID}
          onChange={(e) => setSelectedPubID(e.target.value)}
          required
        >
          <option value="" disabled>Select a pub</option>
          {pubs.map((pub) => (
            <option key={pub.id} value={pub.id}>
              {pub.name}
            </option>
          ))}
        </select>
      </div>

      <button className="btn btn-success" type="submit">
        Submit
      </button>
    </form>
  );
}

export default PintPricing;
