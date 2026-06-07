const dotenv = require("dotenv");
dotenv.config();
console.log("Mongo URI:", process.env.MONGO_URI);
console.log("Key:", process.env.GROQ_API_KEY );
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");


const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/notes",  require("./routes/notes"));
app.use("/api/upload", require("./routes/upload"));


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));