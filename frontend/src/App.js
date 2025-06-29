// App.js
import React, { useState } from "react";
import FetchPubs from "./components/fetchPubs.js";
import PubNavbar from "./components/pubNavbar.js";
import PintPricing from "./components/pintPricing.js";
import Footer from "./components/footer.js";


function App() {
  const [activeSection, setActiveSection] = useState('pubMap')
  const [viewPubID, setViewPubID] = useState("");

  return (
    <div>
      <PubNavbar setActiveSection={setActiveSection}/>
      <FetchPubs viewPubID={viewPubID} setViewPubID={setViewPubID} activeSection={activeSection} setActiveSection={setActiveSection}/>
      {/* <Footer /> */}
    </div>
    
  );
}

export default App;
