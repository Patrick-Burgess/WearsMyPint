function PubNavbar({setActiveSection}) {

    const handleNavClick = (section) => {
        setActiveSection(section);
      };

    return (
        <>
        <nav className="navbar navbar-expand-lg" style={{ backgroundColor: "#D4E9D4", userSelect: "none" }}>
            <div className="container-fluid">
            <h1 className="my-3 mx-5" style={{ fontFamily: "'Crimson Pro', serif" }}>WearsMyPint?</h1>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse mx-5" id="navbarNav">
                <ul className="navbar-nav ms-auto">
                <li className="nav-item mx-2">
                    <a className="nav-link nav-link-custom active" aria-current="page" href="#pubMap" style={{ fontFamily: "'Crimson Pro', serif", fontSize: "1.75rem", color: "#000000" }} onClick={() => handleNavClick('pubMap')}>Pub Map</a>
                </li>
                <li className="nav-item mx-2">
                    <a className="nav-link nav-link-custom" href="#allPubs" style={{ fontFamily: "'Crimson Pro', serif", fontSize: "1.75rem", color: "#000000" }} onClick={() => handleNavClick('allPubs')}>All the Pubs</a>
                </li>
                <li className="nav-item mx-2">
                    <a className="nav-link nav-link-custom" href="#barCrawls" style={{ fontFamily: "'Crimson Pro', serif", fontSize: "1.75rem", color: "#000000" }} onClick={() => handleNavClick('barCrawls')}>Bar Crawls</a>
                </li>
                </ul>
            </div>
            </div>
        </nav>
        </>


    )
}

export default PubNavbar;