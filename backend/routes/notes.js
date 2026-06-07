const express = require("express");
const router  = express.Router();
const {
  generateFromText,
  generateFromURL,
  getAllNotes,
  getNoteById,
  deleteNote,
} = require("../controllers/notesController");

router.post("/generate/text", generateFromText);
router.post("/generate/url",  generateFromURL);
router.get("/",               getAllNotes);
router.get("/:id",            getNoteById);
router.delete("/:id",         deleteNote);

module.exports = router;