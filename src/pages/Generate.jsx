import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NotesDisplay from "../components/NotesDisplay";
import "./Generate.css";

const API = "http://localhost:5000/api";

const Generate = () => {
  const [mode, setMode]               = useState("text");
  const [textInput, setTextInput]     = useState("");
  const [urlInput, setUrlInput]       = useState("");
  const [titleInput, setTitleInput]   = useState("");
  const [pdfFile, setPdfFile]         = useState(null);
  const [loading, setLoading]         = useState(false);
  const [generatedNote, setGeneratedNote] = useState(null);
  const [error, setError]             = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const navigate = useNavigate();

  const handleGenerate = async () => {
    setError(""); setLoading(true); setGeneratedNote(null);
    try {
      let res;
      if (mode === "text" || mode === "voice") {
        if (!textInput.trim()) throw new Error("Please enter some content.");
        res = await axios.post(`${API}/notes/generate/text`, {
          content: textInput,
          inputType: mode,
          title: titleInput || "My Study Notes",
        });
      } else if (mode === "url") {
        if (!urlInput.trim()) throw new Error("Please enter a URL.");
        res = await axios.post(`${API}/notes/generate/url`, { url: urlInput });
      } else if (mode === "pdf") {
        if (!pdfFile) throw new Error("Please select a PDF file.");
        const formData = new FormData();
        formData.append("pdf", pdfFile);
        res = await axios.post(`${API}/upload/pdf`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      setGeneratedNote(res.data.note);
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const startVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return setError("Voice not supported in this browser.");
    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onresult = (e) => {
      const transcript = Array.from(e.results).map(r => r[0].transcript).join("");
      setTextInput(transcript);
    };
    recognition.onerror = () => setError("Voice recognition error.");
    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const stopVoice = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const modes = [
    { id: "text",  label: "✍️ Text"  },
    { id: "pdf",   label: "📄 PDF"   },
    { id: "url",   label: "🔗 URL"   },
    { id: "voice", label: "🎙️ Voice" },
  ];

  return (
    <div className="page">
      <div className="generate-header">
        <h1>Generate Notes</h1>
        <p>Choose your input method and let AI do the rest.</p>
      </div>

      <div className="mode-tabs">
        {modes.map((m) => (
          <button key={m.id}
            className={`mode-tab ${mode === m.id ? "active" : ""}`}
            onClick={() => { setMode(m.id); setError(""); setGeneratedNote(null); }}>
            {m.label}
          </button>
        ))}
      </div>

      
      <div className="card input-card">

        {mode === "text" && (
          <>
            <input className="text-field"
              placeholder="Notes title (optional)"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)} />
            <textarea className="text-area" rows={8}
              placeholder="Paste your topic, chapter content, or notes here..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)} />
          </>
        )}

        {mode === "voice" && (
          <>
            <div className="voice-controls">
              <button className={`voice-btn ${isListening ? "listening" : ""}`}
                onClick={isListening ? stopVoice : startVoice}>
                {isListening ? "⏹ Stop Recording" : "🎙️ Start Recording"}
              </button>
              {isListening && <span className="listening-indicator">● Recording...</span>}
            </div>
            <textarea className="text-area" rows={6}
              placeholder="Your speech will appear here..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)} />
          </>
        )}

        {mode === "url" && (
          <input className="text-field"
            placeholder="https://en.wikipedia.org/wiki/..."
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)} />
        )}

        {mode === "pdf" && (
          <div className="pdf-upload-area"
            onClick={() => document.getElementById("pdf-input").click()}>
            <input id="pdf-input" type="file" accept=".pdf"
              style={{ display: "none" }}
              onChange={(e) => setPdfFile(e.target.files[0])} />
            {pdfFile ? (
              <div className="pdf-selected">
                <span>📄 {pdfFile.name}</span>
                <button className="btn btn-outline"
                  style={{ fontSize: "12px", padding: "4px 12px" }}
                  onClick={(e) => { e.stopPropagation(); setPdfFile(null); }}>
                  Remove
                </button>
              </div>
            ) : (
              <div className="pdf-placeholder">
                <div style={{ fontSize: "40px" }}>📤</div>
                <p>Click to upload PDF</p>
                <span>Max 10MB</span>
              </div>
            )}
          </div>
        )}

        {error && <div className="error-msg">⚠️ {error}</div>}

        <button className="btn btn-primary generate-btn"
          onClick={handleGenerate} disabled={loading}>
          {loading
            ? <><span className="spinner"></span> Generating...</>
            : "✨ Generate Notes"}
        </button>
      </div>

     
      {generatedNote && (
        <div style={{ marginTop: "32px" }}>
          <NotesDisplay note={generatedNote} />
          <div style={{ marginTop: "16px" }}>
            <button className="btn btn-outline" onClick={() => navigate("/saved")}>
              📂 View All Saved Notes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Generate;