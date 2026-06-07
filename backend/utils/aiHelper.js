const Groq = require("groq-sdk");

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const generateNotes = async (content) => {
  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
   messages: [
  {
    role: "user",
    content: `
    Generate detailed study notes on ${content}.
    
    Include:
    1. Introduction
    2. Key Concepts
    3. Examples
    4. Important Points
    5. Summary
    `
  }
]
  
  });

  return response.choices[0].message.content;
};

module.exports = { generateNotes };