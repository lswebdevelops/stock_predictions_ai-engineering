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

  try {
    const res = await fetch("http://localhost:3000/api/openai/match", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: userMessage }),
    });

    const data = await res.json();

    output.innerHTML = `
    <p><strong>Top Match:</strong> ${data.bestMatch.name}</p>
      <p><strong>Similarity:</strong> ${data.score}</p>
    `;

    //
//     output.innerHTML = `
//     <p><strong>Top Match:</strong> ${data.bestMatch.name}</p>
// <p><strong>Description:</strong> ${data.bestMatch.content}</p>
// <p><strong>Similarity:</strong> ${data.score}</p>
//     `;
    //
  } catch (err) {
    output.innerHTML = `<p style="color:red;">Error getting match</p>`;
  }

  input.value = "";
});
