import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();

// on render
app.use(
  cors({
    origin: [
      "https://adivinha-frontend.onrender.com", 
      "https://guess-who-dor0.onrender.com"
    ],
    methods: ["POST"],
  })
);

// on localhost: 
// app.use(
//   cors({
//     origin: "*", // ← permite todas as origens (use só para testes locais!)
//     methods: ["POST"],
//   })
// );


app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const names = ["Andreas", "Eduardo", "Luciano", "Rafael", "Roger", "Lotar", "Alguem que não está aqui"];

const predefinedTexts = [
  `${names[0]}: o ticket alimentação é sempre sua preocupação. Não há dinheiro no mundo que alcance seu salário dos sonhos. Sempre se faz de muito ocupado e se faz de trabalhador. Sempre quer mais ajuda financeira da empresa pra trabalhar de casa.. Pra ele o mercado é muito caro.`,
  `${names[1]}: bem fresco, meio gay. No seu projeto, nunca tem nada o que fazer. Gaúcho. Vive no Rio Grande do Sul debaixo da água, gosta de macho. O cara do hotel que leva cerveja pra ele no quarto de madrugada.`,
  `${names[2]}: um bom pai,é fit e magro, e vai pra academia, estuda muito e gosta de idiomas. O mais bonito da turma com sua barba grande. Pinto grande. Galo cinza. O melhor. muitas namoradas e mulheres.`,
  `${names[3]}: Rico,não gosta da fruta, nerd, é fit e magro, tem um fusca, autista, super inteligente. Deus da informática e do Lotar. Ama bicicletas e Pomerode, e a cultura alemã. Não fala com as pessoas, vive com a mãe e não tem namorada.`,
  `${names[4]}: diz que é de blumenau mas na verdade nasceu em Indaial. passa vergonha na frente dos outros,  Lula 100%, faz o L, pobre e meio gordo, fala muita besteira. Se põe em maus lençóis nas festas por falar demais. Puxa-saco de chefe. Por ser feio, fica olhando demais para as mulheres. Tem pinto pequeno. Ele espanta as mulheres. Estagiários o amam pois ele coloca esperma em seu traseiro (claro, só uma piada interna). Gosta de carros velhos. Ex-colegas de trabalho o temem. Compliance da empresa já lhe deu até certificados. Chevette pra ele é tudo. Quer pegar irmã de todos, mas não pega nada.`,
  `${names[5]}: o melhor chefe do mundo. Bolsonaro, político de direita. Tem muito dinheiro. É do Paraná. Usa facão pra se proteger.`,
  `${names[6]}: o pior chefe do mundo,`,
];

let embeddedTexts = [];

async function generateInitialEmbeddings() {
  const response = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: predefinedTexts,
  });

  embeddedTexts = predefinedTexts.map((text, index) => ({
    content: text,
    embedding: response.data[index].embedding,
  }));

  console.log("✅ Embeddings carregados");
}

function cosineSimilarity(vecA, vecB) {
  const dot = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dot / (magA * magB);
}

app.post("/api/openai/match", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Texto inválido" });
    }

    if (!embeddedTexts.length) {
      return res
        .status(503)
        .json({ error: "Embeddings ainda não carregados. Tente novamente em instantes." });
    }

    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: text,
    });

    const inputEmbedding = embeddingResponse.data[0].embedding;

    let bestMatch = null;
    let bestScore = -1;

    for (let i = 0; i < embeddedTexts.length; i++) {
      const item = embeddedTexts[i];
      const score = cosineSimilarity(inputEmbedding, item.embedding);
      if (score > bestScore) {
        bestScore = score;
        bestMatch = {
          name: names[i],
          content: item.content,
        };
      }
    }

    res.json({ bestMatch, score: bestScore.toFixed(4) });
  } catch (err) {
    console.error("Erro no match:", err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

const PORT = process.env.PORT || 3000;

generateInitialEmbeddings()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Falha ao gerar embeddings:", err);
  });
