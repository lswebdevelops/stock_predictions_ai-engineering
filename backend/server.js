// server.js
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
    console.log("Request body:", req.body); // debug

    const { description } = req.body;

    if (!description || typeof description !== "string") {
      return res.status(400).json({ error: "Invalid description" });
    }

    const prompt = description.trim();

    const completion = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
      style: "vivid",
      response_format: "url",
    });

    const imageUrl = completion.data[0].url;
    res.json({ imageUrl });
  } catch (error) {
    console.error("OpenAI API error:", error);
    res.status(500).json({ error: "Something went wrong on the server." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server listening on port ${PORT}`);
});
