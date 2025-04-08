// App.js
import React from "react";
import PubsList from "./components/pubslist.js";
import PubsMap from "./components/PubsMap";
import FetchPubs from "./components/fetchPubs.js";
import PubNavbar from "./components/pubNavbar.js";

function App() {
  return (
    <div>
      <PubNavbar />
      <FetchPubs />
    </div>
    
  );
}

export default App;
