const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema({
  title:          { type: String, required: true },
  inputType:      { type: String, enum: ["text","pdf","url","voice"], required: true },
  originalInput:  { type: String },
  generatedNotes: { type: String, required: true },
  createdAt:      { type: Date, default: Date.now },
});

module.exports = mongoose.model("Note", NoteSchema);