import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SavedNotes.css";

const API = "http://localhost:5000/api";
const badgeClass = { text:"badge-text", pdf:"badge-pdf", url:"badge-url", voice:"badge-voice" };

const SavedNotes = () => {
  const [notes, setNotes]   = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API}/notes`)
      .then((res) => setNotes(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const deleteNote = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this note?")) return;
    await axios.delete(`${API}/notes/${id}`);
    setNotes((prev) => prev.filter((n) => n._id !== id));
  };

  if (loading) return (
    <div className="page" style={{ textAlign:"center", paddingTop:"80px" }}>
      <span className="spinner" style={{ width:"32px", height:"32px" }}></span>
    </div>
  );

  return (
    <div className="page">
      <div className="saved-header">
        <h1>Saved Notes</h1>
        <p>{notes.length} note{notes.length !== 1 ? "s" : ""} saved</p>
      </div>

      {notes.length === 0 ? (
        <div className="empty-state card">
          <div style={{ fontSize:"48px" }}>📭</div>
          <h3>No notes yet</h3>
          <p>Generate your first study notes to see them here.</p>
          <button className="btn btn-primary" onClick={() => navigate("/generate")}>
            Generate Notes
          </button>
        </div>
      ) : (
        <div className="notes-grid">
          {notes.map((note) => (
            <div key={note._id} className="note-card card"
              onClick={() => navigate(`/note/${note._id}`)}>
              <div className="note-card-header">
                <span className={`badge ${badgeClass[note.inputType] || "badge-text"}`}>
                  {note.inputType}
                </span>
                <button className="btn btn-danger"
                  style={{ fontSize:"12px", padding:"4px 10px" }}
                  onClick={(e) => deleteNote(note._id, e)}>
                  🗑 Delete
                </button>
              </div>
              <h3 className="note-card-title">{note.title}</h3>
              <p className="note-card-preview">{note.generatedNotes.slice(0, 120)}...</p>
              <span className="note-card-date">
                {new Date(note.createdAt).toLocaleDateString("en-IN", {
                  day:"numeric", month:"short", year:"numeric"
                })}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedNotes;