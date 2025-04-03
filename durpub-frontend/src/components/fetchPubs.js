import React, { useEffect, useState } from "react";
import PubRoutingForm from "./pubRoutingForm";

// This component modularises the fetch request to the backend API 
// Acts as a parent component for components that need the pub data
// such as PubRoutingForm
function FetchPubs() {
    const [pubs, setPubs] = useState([]);

    useEffect(() => {
        fetch("http://localhost:3001/api/pubs")
          .then((res) => res.json())
          .then(setPubs)
          .catch(console.error);
    }, []);
    return (
        <div>
        <PubRoutingForm pubs={pubs} />
        </div>
    )
}

export default FetchPubs;