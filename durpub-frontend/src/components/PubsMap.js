// PubsMap.js
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Create a custom icon using your marker image
const customMarkerIcon = L.icon({
    iconUrl: "/marker.png",    // or wherever your image is located
    iconSize: [32, 32],        // size of the icon [width, height]
    iconAnchor: [16, 32],      // point of the icon which will correspond to marker's location
    popupAnchor: [0, -32]      // if you use a popup, offset the popup
  });

function PubsMap({pubs}) {
  const [selectedPub, setSelectedPub] = useState(null);

  // This function is called when a marker is clicked
  const handleMarkerClick = (pub) => {
    setSelectedPub(pub);
  };

  // Center the map around Durham (approx lat/lng)
  const durhamCenter = [54.767999999999999, -1.5774328241809128];

  return (
    <div style={{ display: "flex", height: "75vh" }}>
      {/* Left Column - Map */}
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
          {pubs.map((pub) => (
            <Marker
              key={pub.id}
              position={[pub.lat, pub.lng]}
              icon={customMarkerIcon}
              eventHandlers={{
                click: () => handleMarkerClick(pub)
              }}
            >
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Right Column - Info */}
      <div style={{ width: "400px", padding: "1rem", borderLeft: "1px solid #ccc", wordWrap: "break-word" }}>
        {selectedPub ? (
          <>
            <h2>{selectedPub.name}</h2>
            <p>{selectedPub.location}</p>
            <p>{selectedPub.description}</p>
            <p><strong>Opening Hours: </strong>{selectedPub.opening_hours}</p>
            <p><strong>Average Pint Price: </strong>{selectedPub.average_pint_price}</p>
          </>
        ) : (
          <p>Click a pub marker to see details here.</p>
        )}
      </div>
    </div>
  );

}

export default PubsMap;
