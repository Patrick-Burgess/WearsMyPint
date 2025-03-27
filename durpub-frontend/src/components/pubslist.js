// PubsList.js
import React, { useEffect, useState } from "react";

function PubsList() {
  const [pubs, setPubs] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/pubs") // your backend endpoint
      .then((response) => response.json())
      .then((data) => {
        setPubs(data);
      })
      .catch((error) => {
        console.error("Error fetching pubs:", error);
      });
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">All Pubs</h2>
      <div className="row">
        {pubs.map((pub) => (
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
                  <strong>Average Pint Price:</strong> £{pub.average_pint_price}
                </p>
                <p className="card-text">
                  <strong>Opening Hours:</strong> {pub.opening_hours}
                </p>
                {/* Example button or link if you have more details */}
                <button className="btn btn-primary mt-auto">View Details</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PubsList;