const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");
const output = document.getElementById("chat-output");


async function fetchEmbedding(text) {
  const res = await fetch("http://localhost:3000/api/openai/embedding", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  const data = await res.json();
  console.log("Embedding:", data.embedding);
  return data.embedding;
}


form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userMessage = input.value;
  output.innerHTML += `<p><strong>You:</strong> ${userMessage}</p>`;

  try {
    const embedding = await fetchEmbedding(userMessage);
    output.innerHTML += `<p><strong>Embedding:</strong> [${embedding.slice(0, 5).join(", ")}...]</p>`;
    // You can now use this embedding to search a vector DB, etc.
  } catch (err) {
    output.innerHTML += `<p style="color:red;">Error getting embedding</p>`;
  }

  input.value = "";
});

