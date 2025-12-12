import { Orientation } from '../types';

const API_ENDPOINT = 'https://api.decart.ai/v1/generate/lucy-pro-t2i';
const API_KEY = 'comic-2_zqsavxzUnoDAxNIyEBzpIIiehKhJBIylsBumvIBbnwYgnGvFCWTAnUycbYuutemi';

/**
 * Generates an image using the Decart API (Lucy Pro T2I Model).
 */
export const generatePanelImage = async (
  _apiKey: string, // Kept for compatibility, using hardcoded key
  fullPrompt: string,
  orientation: Orientation
): Promise<string> => {

  try {
    const requestBody = {
      prompt: fullPrompt,
      resolution: '720p',
      orientation: orientation,
    };

    console.log('Decart API Request:', {
      endpoint: API_ENDPOINT,
      body: requestBody,
    });

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'X-API-KEY': API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Decart API Error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      if (data.url) return data.url;
      if (data.image) return `data:image/png;base64,${data.image}`;
      throw new Error("Unexpected JSON format from API");
    } else {
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    }

  } catch (error) {
    console.error('Generation failed:', error);
    throw error;
  }
};
