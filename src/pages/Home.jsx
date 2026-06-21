import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div className="home">
      <div className="home-hero">
        <div className="hero-badge">✨ AI-Powered Learning</div>
        <h1 className="hero-title">
          Generate Smart<br />Study Notes
        </h1>
        <p className="hero-subtitle">
          Transform any topic, PDF, webpage, or voice recording into
          structured, exam-ready study notes using AI.
        </p>
        <div className="hero-actions">
          <Link to="/generate" className="btn btn-outline"
            style={{ fontSize: "16px", padding: "14px 32px" }}>
            🚀 Start Generating
          </Link>
          <Link to="/saved" className="btn btn-outline"
            style={{ fontSize: "16px", padding: "14px 32px" }}>
            📂 View Saved Notes
          </Link>
        </div>
      </div>

      <div className="features-grid">
        {[
          { icon: "✍️", title: "Text Input",  desc: "Type any topic or paste your content to get instant notes." },
          { icon: "📄", title: "PDF Upload",  desc: "Upload your PDF textbooks and get summarized notes." },
          { icon: "🔗", title: "URL Import",  desc: "Paste any webpage URL to extract and summarize content." },
          { icon: "🎙️", title: "Voice Input", desc: "Speak your topic and let AI convert it to structured notes." },
        ].map((f) => (
          <div className="feature-card card" key={f.title}>
            <div className="feature-icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;