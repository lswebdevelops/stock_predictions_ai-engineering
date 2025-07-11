// scripts/seedDocuments.js
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import podcasts from "../content.js";

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_API_KEY);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function seedDocuments() {
  const contents = podcasts

  const embeddingResponse = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: contents,
  });

  const rows = contents.map((text, idx) => ({
    content: text,
    embedding: embeddingResponse.data[idx].embedding,
  }));

  for (const row of rows) {
    const { error } = await supabase.from("documents").insert(row);
    if (error) {
      console.error("Erro ao inserir documento:", error);
    } else {
      console.log("✅ Documento inserido com sucesso");
    }
  }

  console.log("🏁 Finalizado.");
}

seedDocuments();
