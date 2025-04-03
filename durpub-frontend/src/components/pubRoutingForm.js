import React, { useEffect, useState } from "react";

function PubRoutingForm({pubs}) {
    return (
        <select>
          {pubs.map(pub => (
            <option key={pub.id} value={pub.id}>
              {pub.name}
            </option>
          ))}
        </select>
      );
}

export default PubRoutingForm;

