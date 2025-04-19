// PubsList.js
import { useEffect, useState} from "react";
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
  
  //Function to compute the mode of each pint at each different pub
  const getModePricePerDrinkPerPub = (pintData) => {
    const result = {};
    
    //Groups all prices by their respective pubId then thier name
    for (const { id: pubId, drink, price } of pintData) {
      if (!result[pubId]) result[pubId] = {};
      if (!result[pubId][drink]) result[pubId][drink] = [];
  
      result[pubId][drink].push(price);
    }
  
    //Now compute mode per drink per pub
    const modePerPub = {};
  
    //For loop for each pub
    for (const pubId in result) {
      modePerPub[pubId] = {};
      //For loop for each drink in each pub
      for (const drink in result[pubId]) {
        //Calculates the Mode now
        const prices = result[pubId][drink];
        //Creates a frequency map
        const freq = {}; 
  
        for (const price of prices) {
          freq[price] = (freq[price] || 0) + 1;
        }
  
        let mode = null;
        let maxCount = 0;
  
        for (const price in freq) {
          if (freq[price] > maxCount) {
            maxCount = freq[price];
            mode = parseFloat(price);
          }
        }
        //stores the mode price
        modePerPub[pubId][drink] = mode;
      }
    }
  
    return modePerPub;
  };
  
  const updatePubsWithAveragePrice = (pubs, modePrices) => {
    return pubs.map((pub) => {
      const pubModePrices = modePrices[pub.id];
      if (pubModePrices) {
        const drinkPrices = Object.values(pubModePrices);
        const totalPrice = drinkPrices.reduce((sum, price) => sum + price, 0);
        const averagePrice = drinkPrices.length > 0 ? totalPrice / drinkPrices.length : 0;
        return { ...pub, average_pint_price: averagePrice.toFixed(2) };
      }
      return { ...pub, average_pint_price: "N/A" }; // If no mode prices, set to "N/A"
    });
  };
  
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
                  className="btn btn-primary mt-auto"
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