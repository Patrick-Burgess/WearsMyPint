import React, { useEffect, useState } from "react";

function PubRoutingForm() {
    const [pubs, setPubs] = useState([]);

    const handleSubmit = (event) => {
        event.preventDefault();
        alert("Form submitted!");
    };

    return (
        // Creates basic form with a dropdown menu & sumbit button
        <form onSubmit={handleSubmit} className="container mt-4">
            <label>
                Select a pub:
                <select>
                    {pubs.map((pub) => (
                        <option key={pub.id} value={pub.id}>
                            {pub.name}
                        </option>
                    ))}
                </select>
            </label>
            <button type="submit" className="btn btn-primary mt-2">
                Submit
            </button>
        </form>
    );
}

export default PubRoutingForm;

