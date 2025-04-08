import React, { useState, useEffect } from "react";

function PintPricing({ pubs }) {
  const [selectedPubID, setSelectedPubID] = useState("");
  const [selectedDrink, setSelectedDrink] = useState("");
  const [availableDrinks, setAvailableDrinks] = useState([]);

  // Update drinks list when pub changes
  useEffect(() => {
    const pub = pubs.find((p) => p.id === parseInt(selectedPubID));

    if (pub && Array.isArray(pub.onTap)) {
      setAvailableDrinks(pub.onTap);
      setSelectedDrink(""); // Reset drink on pub change
    } else {
      setAvailableDrinks([]);
    }
  }, [selectedPubID, pubs]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const pub = pubs.find((p) => p.id === parseInt(selectedPubID));
    console.log("Selected pub:", pub?.name);
    console.log("Selected drink:", selectedDrink);
  };

  return (
    <form onSubmit={handleSubmit} className="container mt-4 mb-4">
      {/* Pub Dropdown */}
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

      {/* Drink Dropdown */}
      {availableDrinks.length > 0 && (
        <div className="mb-3">
          <label htmlFor="drinkSelect" className="form-label">Select Drink:</label>
          <select
            id="drinkSelect"
            className="form-select"
            value={selectedDrink}
            onChange={(e) => setSelectedDrink(e.target.value)}
            required
          >
            <option value="" disabled>Select a drink</option>
            {availableDrinks.map((drink, index) => (
              <option key={index} value={drink}>
                {drink}
              </option>
            ))}
          </select>
        </div>
      )}

      <button className="btn btn-success" type="submit" disabled={!selectedDrink}>
        Submit
      </button>
    </form>
  );
}

export default PintPricing;