import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ darkMode, setDarkMode }) => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">
        📚 StudyAI
      </Link>

      <div className="nav-links">
        <Link to="/generate"
          className={`nav-link ${location.pathname === "/generate" ? "active" : ""}`}>
          Generate
        </Link>
        <Link to="/saved"
          className={`nav-link ${location.pathname === "/saved" ? "active" : ""}`}>
          Saved Notes
        </Link>

        <div className="theme-toggle" onClick={() => setDarkMode(!darkMode)}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
          <span className="theme-icon">{darkMode ? "🌙" : "☀️"}</span>
          <div className={`toggle-track ${darkMode ? "dark" : "light"}`}>
            <div className="toggle-thumb" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;