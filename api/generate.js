import https from 'https';

const API_KEY = 'comic-2_zqsavxzUnoDAxNIyEBzpIIiehKhJBIylsBumvIBbnwYgnGvFCWTAnUycbYuutemi';

// Helper to read request body
function readBody(req) {
  return new Promise((resolve) => {
    // Check if body is already parsed
    if (req.body && typeof req.body === 'object' && Object.keys(req.body).length > 0) {
      return resolve(req.body);
    }
    if (req.body && typeof req.body === 'string' && req.body.length > 0) {
      try {
        return resolve(JSON.parse(req.body));
      } catch (e) {
        return resolve({});
      }
    }
    // Read from stream
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        resolve({});
      }
    });
  });
}

// Make HTTPS request to Decart
function callDecart(payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);

    const options = {
      hostname: 'api.decart.ai',
      port: 443,
      path: '/v1/generate/lucy-pro-t2i',
      method: 'POST',
      headers: {
        'X-API-KEY': API_KEY,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
    };

    const req = https.request(options, (res) => {
      let responseData = [];

      res.on('data', (chunk) => responseData.push(chunk));
      res.on('end', () => {
        const buffer = Buffer.concat(responseData);
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: buffer,
        });
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
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
    const body = await readBody(req);
    console.log('Received:', JSON.stringify(body));

    const prompt = body?.prompt;
    const orientation = body?.orientation || 'landscape';

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required', received: body });
    }

    const payload = {
      prompt: prompt,
      resolution: '720p',
      orientation: orientation,
    };

    console.log('Sending to Decart:', JSON.stringify(payload));

    const response = await callDecart(payload);
    console.log('Decart status:', response.status);

    if (response.status !== 200) {
      const errorText = response.body.toString();
      console.error('Decart error:', errorText);
      return res.status(response.status).json({ error: `Decart API: ${errorText}` });
    }

    const contentType = response.headers['content-type'] || '';

    if (contentType.includes('application/json')) {
      const data = JSON.parse(response.body.toString());
      if (data.url) return res.status(200).json({ url: data.url });
      if (data.image) return res.status(200).json({ url: `data:image/png;base64,${data.image}` });
      return res.status(500).json({ error: 'No image URL in response' });
    } else {
      const base64 = response.body.toString('base64');
      const mimeType = contentType || 'image/png';
      return res.status(200).json({ url: `data:${mimeType};base64,${base64}` });
    }

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
