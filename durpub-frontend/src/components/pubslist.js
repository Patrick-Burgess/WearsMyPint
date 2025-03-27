// PubsList.js
import React, { useState, useEffect } from "react";

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
  }, []); // empty dependency array -> only run once on mount

  return (
    <div>
      <h2>All Pubs</h2>
      <ul>
        {pubs.map((pub) => (
          <li key={pub.id}>
            <h3>{pub.name}</h3>
            <p>Location: {pub.location}</p>
            <p>{pub.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PubsList;
