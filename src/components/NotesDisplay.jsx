import React from "react";
import { jsPDF } from "jspdf";
import "./NotesDisplay.css";

const badgeClass = {
    text: "badge-text",
    pdf: "badge-pdf",
    url: "badge-url",
    voice: "badge-voice"
};

const NotesDisplay = ({ note }) => {
    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text(note.title, 20, 20);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        const lines = doc.splitTextToSize(
            note.generatedNotes.replace(/\*\*/g, "").replace(/#+\s/g, ""),
            170
        );
        doc.text(lines, 20, 35);
        doc.save(`${note.title}.pdf`);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(note.generatedNotes);
    };

    const renderNotes = (text) => {
        return text.split("\n").map((line, i) => {
            if (line.startsWith("# ")) return <h1 key={i}>{line.slice(2)}</h1>;
            if (line.startsWith("## ")) return <h2 key={i}>{line.slice(3)}</h2>;
            if (line.startsWith("### ")) return <h3 key={i}>{line.slice(4)}</h3>;
            if (line.startsWith("- ") || line.startsWith("* "))
                return <li key={i}>{line.slice(2)}</li>;
            if (line.trim() === "") return <br key={i} />;
            return <p key={i}>{line}</p>;
        });
    };

    return (
        <div className="notes-display card">
            <div className="notes-header">
                <div>
                    <h2 className="notes-title">{note.title}</h2>
                    <span className={`badge ${badgeClass[note.inputType] || "badge-text"}`}>
                        {note.inputType}
                    </span>
                </div>
                <div className="notes-actions">
                    <button className="btn btn-outline" onClick={copyToClipboard}>📋 Copy</button>
                    <button className="btn btn-outline" onClick={downloadPDF}>⬇️ PDF</button>
                </div>
            </div>
            <div className="notes-body notes-content">
                {renderNotes(note.generatedNotes)}
            </div>
        </div>
    );
};

export default NotesDisplay;