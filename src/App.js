import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Generate from "./pages/Generate";
import SavedNotes from "./pages/SavedNotes";
import NoteDetail from "./pages/NoteDetail";
import "./App.css";

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    
    return localStorage.getItem("theme") !== "light";
  });

  useEffect(() => {
    document.body.setAttribute("data-theme", darkMode ? "dark" : "light");
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <Router>
      <div className="app">
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
        <Routes>
          <Route path="/"        element={<Home />} />
          <Route path="/generate" element={<Generate />} />
          <Route path="/saved"   element={<SavedNotes />} />
          <Route path="/note/:id" element={<NoteDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;