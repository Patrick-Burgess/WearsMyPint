// PubsList.js
import { useEffect, useState } from "react";
import { getModePricePerDrinkPerPub, updatePubsWithAveragePrice } from "./modeAndAverageCalculator.js";

function PubsList({ viewPubID, setViewPubID, activeSection, setActiveSection, pubs }) {
  const [pintData, setPintData] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  // API GET request for information from pintPricing.json
  useEffect(() => {
    (async function () {
      try {
        const response = await fetch("http://localhost:3001/api/pint");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPintData(data);
        console.log(response);
      } catch (error) {
        console.log("Fetch error", error);
      }
    })();
  }, []);

  const modePrices = getModePricePerDrinkPerPub(pintData);
  console.log("MODE PRICES: ", modePrices);
  const updatedPubs = updatePubsWithAveragePrice(pubs, modePrices);

  // Filter pubs based on the search query
  const filteredPubs = updatedPubs.filter((pub) =>
    pub.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h2 className="mb-4">All Pubs</h2>

      {/* Search bar */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search pubs by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update search query state
        />
      </div>

      <div className="row">
        {filteredPubs.map((pub) => (
          <div className="col-md-4 mb-4" key={pub.id}>
            <div className="card h-100">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{pub.name}</h5>
                <h6 className="card-subtitle mb-2 text-muted">{pub.location}</h6>
                <p className="card-text flex-grow-1">{pub.description}</p>
                <p className="card-text">
                  <strong>Opening Hours:</strong> {pub.opening_hours}
                </p>
                <p className="card-text">
                  <strong>Average Pint Price:</strong> £{pub.average_pint_price}
                </p>
                {modePrices[pub.id] && (
                  <div className="mt-3">
                    <h6>Pint Prices: </h6>
                    <ul className="list-unstyled">
                      {Object.entries(modePrices[pub.id]).map(([drink, price]) => (
                        <li key={drink}>
                          {drink}: £{price.toFixed(2)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <button
                  className="btn btn-success mt-auto"
                  onClick={() => {
                    setViewPubID(pub.id); // Get the pub's ID
                    setActiveSection("pubMap");
                  }}
                >
                  View on Map
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PubsList;