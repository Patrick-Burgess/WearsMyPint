// App.js
import React from "react";
import PubsList from "./components/pubslist.js";
import PubsMap from "./components/PubsMap";
import PubRoutingForm from "./components/pubRoutingForm.js";

function App() {
  return (
    <div>
      <h1 className="text-center mt-4 mb-5">DurPub</h1>
      <PubsMap />
      <br />
      <br />
      <PubsList />

      <br />
      <br />
      <PubRoutingForm />
    </div>
    
  );
}

export default App;
