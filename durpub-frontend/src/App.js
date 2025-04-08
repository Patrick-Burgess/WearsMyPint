// App.js
import React, { useState } from "react";
import FetchPubs from "./components/fetchPubs.js";
import PubNavbar from "./components/pubNavbar.js";
import PintPricing from "./components/pintPricing.js";
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
