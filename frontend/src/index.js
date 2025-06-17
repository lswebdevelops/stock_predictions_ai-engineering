// index.js
const submitBtn = document.getElementById('submit-btn');
const instructionField = document.getElementById('instruction');
const outputImgDiv = document.getElementById('output-img');

submitBtn.addEventListener('click', async () => {
  const description = instructionField.value.trim();

  if (!description || description.length < 10) {
    outputImgDiv.innerHTML = `<p style="color: red;">Please write a longer description.</p>`;
    return;
  }

  outputImgDiv.innerHTML = `<p>🎨 Generating image...</p>`;

  try {
    const response = await fetch('http://localhost:3000/api/openai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ description })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Unknown error");
    }

    if (data.imageUrl) {
      outputImgDiv.innerHTML = `
        <img src="${data.imageUrl}" alt="Generated image" style="max-width: 100%; border-radius: 8px; margin-top: 1rem;" />
      `;
    } else {
      outputImgDiv.innerHTML = `<p style="color: red;">No image received.</p>`;
    }
  } catch (err) {
    console.error(err);
    outputImgDiv.innerHTML = `<p style="color: red;">❌ Failed to generate image. Try again.</p>`;
  }
});
