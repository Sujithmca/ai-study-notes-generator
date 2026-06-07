const Note = require("../models/Note");
const { generateNotes } = require("../utils/aiHelper");
const axios = require("axios");
const cheerio = require("cheerio");

const getWikipediaText = async (url) => {
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.endsWith("wikipedia.org")) return null;

    const wikiMatch = parsed.pathname.match(/^\/wiki\/(.+)$/);
    if (!wikiMatch) return null;

    const articleTitle = decodeURIComponent(wikiMatch[1]);
    const apiUrl = `https://${parsed.hostname}/w/api.php`;
    const response = await axios.get(apiUrl, {
      params: {
        action: "query",
        prop: "extracts",
        explaintext: "1",
        redirects: "1",
        format: "json",
        titles: articleTitle,
      },
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    const pages = response.data?.query?.pages;
    if (!pages) return null;

    const page = Object.values(pages)[0];
    return page?.extract ? page.extract.replace(/\s+/g, " ").trim() : null;
  } catch (err) {
    console.error("Wikipedia fetch failed:", err.message || err);
    return null;
  }
};

const extractTextFromHtml = (html) => {
  const $ = cheerio.load(html);
  $("script, style, nav, footer, header, aside").remove();
  return $("body").text().replace(/\s+/g, " ").trim();
};

const generateFromText = async (req, res) => {
  try {
    const { content, inputType, title } = req.body;
    if (!content) return res.status(400).json({ error: "Content is required" });

    const notes = await generateNotes(content);
    const note = new Note({
      title: title || "Untitled Notes",
      inputType: inputType || "text",
      originalInput: content,
      generatedNotes: notes,
    });
    await note.save();
    res.json({ success: true, note });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate notes" });
  }
};


const generateFromURL = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });

    let text = await getWikipediaText(url);
    let pageTitle = url;

    if (!text) {
      const response = await axios.get(url, {
        headers: { "User-Agent": "Mozilla/5.0" },
      });
      const $ = cheerio.load(response.data);
      $("script, style, nav, footer, header, aside").remove();
      text = $("body").text().replace(/\s+/g, " ").trim().slice(0, 5000);
      pageTitle = $("title").text() || url;
    }

    if (!text) return res.status(400).json({ error: "Could not extract text from URL" });

    const notes = await generateNotes(text);
    const note = new Note({
      title: pageTitle,
      inputType: "url",
      originalInput: url,
      generatedNotes: notes,
    });
    await note.save();
    res.json({ success: true, note });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch URL or generate notes" });
  }
};


const getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notes" });
  }
};


const getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ error: "Note not found" });
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch note" });
  }
};


const deleteNote = async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete note" });
  }
};

module.exports = { generateFromText, generateFromURL, getAllNotes, getNoteById, deleteNote };