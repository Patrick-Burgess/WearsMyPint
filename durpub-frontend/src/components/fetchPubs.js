import React, { useEffect, useState } from "react";
import PubsList from "./pubslist";
import PubRoutingForm from "./pubRoutingForm";
import PubsMap from "./PubsMap";

// This component modularises the fetch request to the backend API 
// Acts as a parent component for components that need the pub data
// such as PubRoutingForm
function FetchPubs({activeSection}) {
    const [pubs, setPubs] = useState([]);
    const [route, setRoute] = useState([]);
    // const [latlngs, setLatlngs] = useState([])

    useEffect(() => {
        fetch("http://localhost:3001/api/pubs")
          .then((res) => res.json())
          .then(setPubs)
          .catch(console.error);
    }, []);
    return (
        <>
            {activeSection === 'pubMap' && <PubsMap pubs={pubs} route={route} />}
            {activeSection === 'allPubs' && <PubsList pubs={pubs} />}
            {activeSection === 'barCrawls' && <PubRoutingForm pubs={pubs} route={route} setRoute={setRoute} />}
        </>
    )
}

export default FetchPubs;