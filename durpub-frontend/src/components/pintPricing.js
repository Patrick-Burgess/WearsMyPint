import React, { useState, useEffect } from "react";

function PintPricing({ pubs }) {
  //React states for selected Pubs, Drinks, Availabledrinks, Prices
  const [selectedPubID, setSelectedPubID] = useState("");
  const [selectedDrink, setSelectedDrink] = useState("");
  const [availableDrinks, setAvailableDrinks] = useState([]);
  const [price, setPrice] = useState("");

  //Update drinks list when pub changes
  useEffect(() => {
    const pub = pubs.find((p) => p.id === parseInt(selectedPubID));

    if (pub && Array.isArray(pub.onTap)) {
      setAvailableDrinks(pub.onTap);//Changes drinks ontap
      setSelectedDrink(""); //Resets selected drink
      setPrice(""); //Resets Price
    } else {
      setAvailableDrinks([]); //Doesn't show drinks if their isn't a pub/ontap drinks
    }
  }, [selectedPubID, pubs]);

  //The form is submitted
  const handleSubmit = async (e) => {
    e.preventDefault();
    //logging output
    const pub = pubs.find((p) => p.id === parseInt(selectedPubID));
    console.log("Selected pub:", pub?.name);
    console.log("Selected PubID:", selectedPubID)
    console.log("Selected drink:", selectedDrink);
    console.log("Entered price:", price);
    
    //Creating the object to be sent to the API
    let submittedPintInfo = {
      id:parseInt(selectedPubID),
      drink:selectedDrink,
      price:parseFloat(price)
    }

    //API POST REQUEST
    try {
      const response = await fetch ('http://localhost:3001/api/pint',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body:JSON.stringify(submittedPintInfo)
      })
      if (!response.ok){
        alert("Price must be below £10.");
        throw new Error(`Server responded with status ${response.status}. The price was too high.`);
      }
      const result = await response.json();
      console.log("Submitted Drink Pricing: ",result);
      alert("Pint pricing submitted successfully!");
    } catch  (error) {
      console.error(`Error Posting submittedDrinkInfo`, error)
    }

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
      {/* Pint Price */}
      {selectedDrink && (
        <div className="mb-3">
          <label htmlFor="priceInput" className="form-label">Enter Pint Price (£):</label>
          <input type="number"step="0.01"min="0"className="form-control"id="priceInput"value={price}onChange={(e) => setPrice(e.target.value)}required/>
        </div>
      )}

      <button className="btn btn-success" type="submit" disabled={!selectedDrink || !price}>
        Submit
      </button>
    </form>
  );
}

export default PintPricing;