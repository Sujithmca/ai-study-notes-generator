import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import NotesDisplay from "../components/NotesDisplay";

const API = "http://localhost:5000/api";

const NoteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/notes/${id}`)
      .then((res) => setNote(res.data))
      .catch(() => navigate("/saved"))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return (
    <div className="page" style={{ textAlign:"center", paddingTop:"80px" }}>
      <span className="spinner" style={{ width:"32px", height:"32px" }}></span>
    </div>
  );

  return (
    <div className="page">
      <button className="btn btn-outline"
        style={{ marginBottom:"24px" }}
        onClick={() => navigate("/saved")}>
        ← Back to Saved Notes
      </button>
      {note && <NotesDisplay note={note} />}
    </div>
  );
};

export default NoteDetail;