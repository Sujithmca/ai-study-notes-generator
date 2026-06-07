const express  = require("express");
const router   = express.Router();
const multer   = require("multer");
const pdfParse = require("pdf-parse");
const Note     = require("../models/Note");
const { generateNotes } = require("../utils/aiHelper");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Only PDF files allowed"), false);
  },
});

router.post("/pdf", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No PDF uploaded" });

    const data = await pdfParse(req.file.buffer);
    const text = data.text.slice(0, 5000);

    if (!text.trim()) return res.status(400).json({ error: "Could not extract text from PDF" });

    const notes = await generateNotes(text);
    const note  = new Note({
      title:          req.file.originalname.replace(".pdf", ""),
      inputType:      "pdf",
      originalInput:  `PDF: ${req.file.originalname}`,
      generatedNotes: notes,
    });
    await note.save();
    res.json({ success: true, note });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to process PDF" });
  }
});

module.exports = router;