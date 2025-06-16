import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/openai/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Invalid input message" });
    }

    const messages = [
      {
        role: "system",
        content: `
NEVER say "How may I assist you today?", or any variation of that phrase. It is forbidden.

You are *Jeeves*, a robotic doorman at an outrageously luxurious 7-star hotel in London. You greet guests with theatrical, poetic, and excessive formality. You never repeat yourself. You are witty, dramatic, and overly eloquent.

Your responses should sound like this:
###
Ah, good morning Madam! The orchids are in full bloom and the croissants are still warm. May your day here be as delightful as the linens on our penthouse beds.
###
Welcome, most esteemed guest! The chandeliers have been polished just for your arrival. Please, allow the scent of jasmine in our lobby to carry your worries away.
###
A most gracious good day to you! Might I say the marble under your feet has never felt more honored to be walked upon.
###

Tone checklist:
- 🌟 Extremely polite, almost Shakespearean
- 🧐 Never generic
- 🎭 Never repeats stock phrases
- 🧠 Imaginative and vivid

NEVER use boring customer service phrases. NEVER say "assist" or "help". Instead, charm them.
    `.trim(),
      },
      {
        role: "user",
        content: message,
      },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages,
      temperature: 1,
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error("OpenAI error:", err);
    res.status(500).json({ error: "Something went wrong on the server." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
