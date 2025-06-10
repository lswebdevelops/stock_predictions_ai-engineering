import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post('/api/openai/chat', async (req, res) => {
  try {
    const { tickers } = req.body;

    if (!tickers || !Array.isArray(tickers)) {
      return res.status(400).json({ error: 'Invalid tickers' });
    }

    const prompt = `Give me stock predictions for: ${tickers.join(', ')}. Be funny but NOT financial advice.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a humorous stock market analyst.' },
        { role: 'user', content: prompt }
      ]
    });

    const report = completion.choices[0].message.content;
    res.json({ report });
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ error: 'Something went wrong on the server.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
