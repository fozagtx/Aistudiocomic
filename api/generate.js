const API_KEY = 'comic-2_zqsavxzUnoDAxNIyEBzpIIiehKhJBIylsBumvIBbnwYgnGvFCWTAnUycbYuutemi';
const API_URL = 'https://api.decart.ai/v1/generate/lucy-pro-t2i';

// Helper to read request body from stream
function readBodyStream(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        resolve({});
      }
    });
    req.on('error', reject);
  });
}

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
    // Try multiple ways to get the body
    let body;

    // Method 1: Vercel might auto-parse req.body
    if (req.body && typeof req.body === 'object' && Object.keys(req.body).length > 0) {
      body = req.body;
      console.log('Using req.body (auto-parsed)');
    }
    // Method 2: req.body might be a string
    else if (req.body && typeof req.body === 'string') {
      try {
        body = JSON.parse(req.body);
        console.log('Parsed req.body from string');
      } catch (e) {
        body = {};
      }
    }
    // Method 3: Read from stream
    else {
      body = await readBodyStream(req);
      console.log('Read body from stream');
    }

    console.log('Final body:', JSON.stringify(body));

    const prompt = body?.prompt;
    const orientation = body?.orientation || 'landscape';

    if (!prompt) {
      return res.status(400).json({
        error: 'Prompt is required',
        debug: {
          bodyType: typeof req.body,
          bodyKeys: req.body ? Object.keys(req.body) : [],
          parsedBody: body
        }
      });
    }

    console.log('Calling Decart with prompt length:', prompt.length);

    const decartPayload = {
      prompt: String(prompt),
      resolution: '720p',
      orientation: String(orientation),
    };

    const bodyString = JSON.stringify(decartPayload);
    console.log('Decart request body:', bodyString);
    console.log('Body length:', bodyString.length);

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'X-API-KEY': API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: bodyString,
    });

    console.log('Decart response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Decart error:', response.status, errorText);
      return res.status(response.status).json({ error: `Decart API: ${errorText}` });
    }

    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      if (data.url) {
        return res.status(200).json({ url: data.url });
      }
      if (data.image) {
        return res.status(200).json({ url: `data:image/png;base64,${data.image}` });
      }
      return res.status(500).json({ error: 'No image URL in response' });
    } else {
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
