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

// Predefined content
const predefinedTexts = [
  "Beyond Mars: speculating life on distant planets.",
  "Jazz under stars: a night in New Orleans' music scene.",
  "Mysteries of the deep: exploring uncharted ocean caves.",
  "Rediscovering lost melodies: the rebirth of vinyl culture.",
  "Tales from the tech frontier: decoding AI ethics.",
];

let embeddedTexts = [];

// Generate embeddings for predefined content
async function generateInitialEmbeddings() {
  const response = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: predefinedTexts,
  });

  embeddedTexts = predefinedTexts.map((text, index) => ({
    content: text,
    embedding: response.data[index].embedding,
  }));

  console.log("✅ Initial embeddings generated");
}

// Cosine similarity function
function cosineSimilarity(vecA, vecB) {
  const dot = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dot / (magA * magB);
}

// Matching route
app.post("/api/openai/match", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Invalid input text" });
    }

    if (!embeddedTexts.length) {
      return res.status(503).json({ error: "Embeddings not ready yet. Please try again shortly." });
    }

    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: text,
    });

    const inputEmbedding = embeddingResponse.data[0].embedding;

    // Find best match
    let bestMatch = null;
    let bestScore = -1;

    for (const item of embeddedTexts) {
      const score = cosineSimilarity(inputEmbedding, item.embedding);
      console.log(`Checking against: "${item.content}" → score: ${score.toFixed(4)}`);
      if (score > bestScore) {
        bestScore = score;
        bestMatch = item.content;
      }
    }

    res.json({ bestMatch, score: bestScore.toFixed(4) });
  } catch (err) {
    console.error("Match error:", err);
    res.status(500).json({ error: "Failed to match content" });
  }
});

// Start server only after embeddings are ready
const PORT = process.env.PORT || 3000;

generateInitialEmbeddings()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to initialize embeddings:", err);
  });
