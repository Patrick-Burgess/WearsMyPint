// App.js
import React from "react";
import PubsList from "./components/pubslist.js";
import PubsMap from "./components/PubsMap";
import FetchPubs from "./components/fetchPubs.js";

function App() {
  return (
    <div>
      <h1 className="text-center mt-4 mb-5">DurPub</h1>
      <FetchPubs />
    </div>
    
  );
}

export default App;
