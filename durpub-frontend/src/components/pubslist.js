// PubsList.js
import { useEffect, useState} from "react";
import { getModePricePerDrinkPerPub, updatePubsWithAveragePrice } from "./modeAndAverageCalculator.js";

function PubsList({viewPubID, setViewPubID, activeSection, setActiveSection, pubs}) {
  
  const[pintData, setPintData] = useState([])

  //API GET request for information from pintPricing.json
  useEffect(() => {
    (async function(){
      try {
        const response = await fetch("http://localhost:3001/api/pint")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json();
        //Sends JSON data out of this function
        setPintData(data);
        console.log(response)
      } catch(error){
        console.log("Fetch error", error)
      }
    })();
  }, []);
  
  const modePrices = getModePricePerDrinkPerPub(pintData);
  console.log("MODE PRICES: ", modePrices);
  const updatedPubs = updatePubsWithAveragePrice(pubs, modePrices);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">All Pubs</h2>
      <div className="row">
        {updatedPubs.map((pub) => (
          <div className="col-md-4 mb-4" key={pub.id}>
            <div className="card h-100">
              {/* If you have a pub image, you can do:
              <img src={pub.imageUrl} className="card-img-top" alt={pub.name} />
              */}
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{pub.name}</h5>
                <h6 className="card-subtitle mb-2 text-muted">{pub.location}</h6>
                <p className="card-text flex-grow-1">
                  {pub.description}
                </p>
                {/* Additional pub details */}
                <p className="card-text">
                  <strong>Opening Hours:</strong> {pub.opening_hours}
                </p>
                <p className="card-text">
                  <strong>Average Pint Price:</strong> £{pub.average_pint_price}
                </p>
                {/*Pint Prices list using Get request */}
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
                
                {/* Example button or link if you have more details */}
                <button
                  className="btn btn-success mt-auto"
                  onClick={() => {
                    setViewPubID(pub.id); // Get the pub's ID
                    setActiveSection('pubMap')
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