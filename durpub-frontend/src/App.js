// App.js
import React, { useState } from "react";
import PubsList from "./components/pubslist.js";
import PubsMap from "./components/PubsMap";
import FetchPubs from "./components/fetchPubs.js";
import PubNavbar from "./components/pubNavbar.js";

function App() {
  const [activeSection, setActiveSection] = useState('pubMap')

  return (
    <div>
      <PubNavbar setActiveSection={setActiveSection}/>
      <FetchPubs activeSection={activeSection}/>
    </div>
    
  );
}

export default App;
