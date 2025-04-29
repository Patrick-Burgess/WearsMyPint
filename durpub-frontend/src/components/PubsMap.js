// PubsMap.js
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import polyline from "@mapbox/polyline";
import { Polyline } from "react-leaflet"
import { getModePricePerDrinkPerPub, updatePubsWithAveragePrice } from "./modeAndAverageCalculator.js";

// Create a custom icon using your marker image
const customMarkerIcon = L.icon({
    iconUrl: "/marker.png",    // or wherever your image is located
    iconSize: [32, 32],        // size of the icon [width, height]
    iconAnchor: [16, 32],      // point of the icon which will correspond to marker's location
    popupAnchor: [0, -32]      // if you use a popup, offset the popup
  });

// these numbered icons are displayed once a route has been selected
function createNumberedIcon(number) {
  return L.divIcon({
    className: "numbered-marker",
    html: `<div class="marker-number">${number}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });
}

function PubsMap({viewPubID, setViewPubID, pubs = [], route = []}) {

  // called decodedRoute because ors api sends back some cryptic ass string of info
  const [decodedRoute, setDecodedRoute] = useState([])

  // Center the map around Durham (approx lat/lng)
  const durhamCenter = [54.767999999999999, -1.5774328241809128];

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

  useEffect(() => {
    if (route.length < 2) return; // Need at least start and end

    fetch("http://localhost:3001/api/pubs/walking-route", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pubIDs: route }),
    })
      .then((res) => res.json())
      .then((data) => {
        const decoded = polyline.decode(data.routes[0].geometry);
        // ors uses lngslat but leaflet uses latlng, so need to flip
        const latlngs = decoded.map(([lat, lng]) => [lat, lng]);
        setDecodedRoute(latlngs);
      })
      .catch((err) => console.error("Error getting route:", err));
  }, [route]); // updates when there is a route to display (i.e when route updates)

  const modePrices = getModePricePerDrinkPerPub(pintData);
  const updatedPubs = updatePubsWithAveragePrice(pubs, modePrices);

  return (
    <div style={{ display: "flex", height: "87vh", backgroundColor: "#f8f9fa"}}>
      <div style={{ flex: 1 }}>
        <MapContainer
          center={durhamCenter}
          zoom={15}
          style={{ width: "100%", height: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">
            OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {route.length === 0 ? (
  // Classic markers for all pubs when no route is selected
          updatedPubs.map((pub) => {
            const handlers =
              pub.id === viewPubID
                ? {
                    add: (e) => e.target.openPopup(),
                    popupopen: () => setViewPubID(""),
                  }
                : {};

            return (
              <Marker
                key={pub.id}
                position={[pub.lat, pub.lng]}
                icon={customMarkerIcon}
                eventHandlers={handlers}
              >
                <Popup>
                  <h2>{pub.name}</h2>
                  <p>{pub.location}</p>
                  <p>{pub.description}</p>
                  <p><strong>Opening Hours: </strong>{pub.opening_hours}</p>
                  <p><strong>Average Pint Price: </strong>{pub.average_pint_price}</p>
                </Popup>
              </Marker>
            )})
        ) : (
          // Numbered route markers in order
          route.map((id, index) => {
            const pub = updatedPubs.find((p) => p.id === id);
            if (!pub) return null;

            return (
              <Marker
                key={pub.id}
                position={[pub.lat, pub.lng]}
                icon={createNumberedIcon(index + 1)}
              >
                <Popup>
                  <h2>{pub.name}</h2>
                  <p>{pub.location}</p>
                  <p>{pub.description}</p>
                  <p><strong>Opening Hours: </strong>{pub.opening_hours}</p>
                  <p><strong>Average Pint Price: </strong>{pub.average_pint_price}</p>
              </Popup>
              </Marker>
            );
          })
        )}

          {decodedRoute.length > 0 && (
            <Polyline positions={decodedRoute} pathOptions={{ color: "red" }} />
          )}
        </MapContainer>
      </div>
    </div>
  );

}

export default PubsMap;
