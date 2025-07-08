const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");
const output = document.getElementById("chat-output");

// Lê a variável de ambiente VITE_BACKEND_URL
const BACKEND_URL = import.meta.env?.VITE_BACKEND_URL || "http://localhost:3000";


form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userMessage = input.value;

  try {
    const res = await fetch(`${BACKEND_URL}/api/openai/match`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: userMessage }),
    });

    const data = await res.json();

    output.innerHTML = `
      <p><strong>Top Match:</strong> ${data.bestMatch.name}</p>
      
      <p><strong>Similarity:</strong> ${data.score}</p>
    `;

    //<p><strong>Description:</strong> ${data.bestMatch.content}</p>
  } catch (err) {
    output.innerHTML = `<p style="color:red;">Erro ao buscar correspondência</p>`;
  }

  input.value = "";
});
