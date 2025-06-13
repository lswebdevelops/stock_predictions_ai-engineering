const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");
const output = document.getElementById("chat-output");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userMessage = input.value;
  output.innerHTML = `<p><strong>You:</strong> ${userMessage}</p>`;

  try {
    const res = await fetch("http://localhost:3000/api/openai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage }),
    });

    const data = await res.json();
    output.innerHTML += `<p><strong>Doorman:</strong> ${data.reply}</p>`;
  } catch (err) {
    output.innerHTML += `<p style="color:red;">Error: Could not reach the server.</p>`;
  }

  input.value = "";
});
