import React, { useState, useEffect } from "react";
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 

function PubRoutingForm({ pubs, route, setRoute }) {
  const [startPubID, setStartPubID] = useState("");
  const [endPubID, setEndPubID] = useState("");
  const [savedRoutes, setSavedRoutes] = useState([])
  const [currentRoute, setCurrentRoute] = useState([])

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
  useEffect(() => {
    const fullRoute = (route || []).map((id) =>
      pubs.find((pub) => pub.id === id)
    );
    setCurrentRoute(fullRoute);
  }, [route, pubs]);

  function handleSave() {

    let routeID = 0
    let existingRoutes = []

    const stored = localStorage.getItem("savedRoutes");
    if (stored) {
      existingRoutes = JSON.parse(stored);
      routeID = existingRoutes[existingRoutes.length - 1].routeID + 1
    }

    const routeToAdd = {
      routeID: routeID,
      route : currentRoute
    }

    const updatedRoutes = [...existingRoutes, routeToAdd];

    setSavedRoutes(updatedRoutes)
    localStorage.setItem("savedRoutes", JSON.stringify(updatedRoutes))
  }

  function handleClear() {

    localStorage.removeItem("savedRoutes")

    setSavedRoutes([])

  }

  return (
    <div className="container mt-4 my-5">
      <h2 className="mb-4">Plan Your Pub Route</h2>
      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-6">
          <label htmlFor="fromSelect" className="form-label">
            From:
          </label>
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

        <div className="col-md-6">
          <label htmlFor="toSelect" className="form-label">
            To:
          </label>
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

        <div className="col-12">
          <button className="btn btn-success w-100" type="submit">
            Get Route
          </button>
        </div>
      </form>

      <div className="mt-4">
        {route.length > 0 && ( // Only show this section if the route array has items
          <>
            <h4>Route:</h4>
            <ol className="list-group list-group-numbered">
              {currentRoute.map((pub) => (
                <li className="list-group-item" key={pub.id}>
                  {pub.name}
                </li>
              ))}
            </ol>
          </>
        )}
      </div>

      <div className="col-12 my-4">
          <button className="btn btn-success w-100" type="button" onClick={() => handleSave()}>
            Save Route
          </button>
      </div>

      <div className="col-12 my-4">
        <div className="dropdown">
          <button className="btn btn-secondary dropdown-toggle w-100" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            Previous Routes
          </button>
          <ul className="dropdown-menu">
            {savedRoutes.map((savedRoute) => (
              <li><button className="dropdown-item" onClick={() => setCurrentRoute(savedRoute.route)}>{savedRoute.route[0].name} to {savedRoute.route[savedRoute.route.length - 1].name}</button></li>
            ))}
          </ul>
        </div>
      </div>

      <div className="col-12 my-4">
          <button className="btn btn-success w-100" type="button" onClick={() => handleClear()}>
            Clear Previous Routes
          </button>
      </div>

    </div>
  );
}

export default PubRoutingForm;


