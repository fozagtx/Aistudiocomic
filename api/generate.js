import { createDecartClient, models } from "@decartai/sdk";

const API_KEY = 'comic-2_zqsavxzUnoDAxNIyEBzpIIiehKhJBIylsBumvIBbnwYgnGvFCWTAnUycbYuutemi';

const client = createDecartClient({
  apiKey: API_KEY
});

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, orientation } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    console.log('Generating image with prompt:', prompt);

    const result = await client.process({
      model: models.image("lucy-pro-t2i"),
      prompt: prompt,
    });

    console.log('Decart result:', result);

    if (result && result.url) {
      return res.status(200).json({ url: result.url });
    }

    if (result && result.image) {
      return res.status(200).json({ url: `data:image/png;base64,${result.image}` });
    }

    return res.status(500).json({ error: 'No image in response' });

  } catch (error) {
    console.error('Decart API error:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate image' });
  }
}
