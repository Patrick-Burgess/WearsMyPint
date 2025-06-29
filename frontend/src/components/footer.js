import React from "react";

function Footer() {
  return (
    <footer style={{ backgroundColor: "#343a40", color: "#fff", padding: "1rem 0", textAlign: "center", marginTop: "auto" }}>
    <div className="container">
        <p>&copy; {new Date().getFullYear()} Durham Pub Finder. All Rights Reserved.</p>
        <p>
        <a href="/about" style={{ color: "#ffc107", textDecoration: "none" }}>About Us</a> | 
        <a href="/contact" style={{ color: "#ffc107", textDecoration: "none", marginLeft: "10px" }}>Contact</a>
        </p>
    </div>
    </footer> 
  );
}

export default Footer;