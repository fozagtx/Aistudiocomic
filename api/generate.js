const API_KEY = 'comic-2_zqsavxzUnoDAxNIyEBzpIIiehKhJBIylsBumvIBbnwYgnGvFCWTAnUycbYuutemi';
const API_URL = 'https://api.decart.ai/v1/generate/lucy-pro-t2i';

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
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
    // Parse body - handle both string and object
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        return res.status(400).json({ error: 'Invalid JSON body' });
      }
    }

    // Log for debugging
    console.log('Received body:', JSON.stringify(body));

    const prompt = body?.prompt;
    const orientation = body?.orientation || 'landscape';

    if (!prompt) {
      return res.status(400).json({
        error: 'Prompt is required',
        received: body
      });
    }

    console.log('Calling Decart API with prompt:', prompt.substring(0, 100));

    const decartBody = {
      prompt: prompt,
      resolution: '720p',
      orientation: orientation,
    };

    console.log('Sending to Decart:', JSON.stringify(decartBody));

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'X-API-KEY': API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(decartBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Decart API error:', response.status, errorText);
      return res.status(response.status).json({ error: `Decart API: ${errorText}` });
    }

    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      console.log('Decart response:', JSON.stringify(data));
      if (data.url) {
        return res.status(200).json({ url: data.url });
      }
      if (data.image) {
        return res.status(200).json({ url: `data:image/png;base64,${data.image}` });
      }
      return res.status(500).json({ error: 'No image URL in response', data });
    } else {
      // Return image as base64
      const buffer = await response.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');
      const mimeType = contentType || 'image/png';
      return res.status(200).json({ url: `data:${mimeType};base64,${base64}` });
    }

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: error.message || 'Server error' });
  }
}
