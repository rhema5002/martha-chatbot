const express = require('express');
const path = require('path');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const app = express();
app.use(express.json());

const port = process.env.PORT || 5173;

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    const response = await openai.createChatCompletion({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 1000,
      temperature: 0.2
    });

    const assistant = response.data.choices[0].message;
    res.json({ assistant });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'OpenAI request failed' });
  }
});

app.use(express.static(path.join(__dirname, 'client')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

app.listen(port, () => console.log(`Server running on port ${port}`));


