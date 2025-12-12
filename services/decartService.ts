import { Orientation } from '../types';

/**
 * Generates an image using our serverless API that calls Decart.
 */
export const generatePanelImage = async (
  _apiKey: string,
  fullPrompt: string,
  orientation: Orientation
): Promise<string> => {

  try {
    console.log('Calling generate API:', { prompt: fullPrompt, orientation });

    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: fullPrompt,
        orientation: orientation,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to generate image');
    }

    if (data.url) {
      return data.url;
    }

    throw new Error('No image URL in response');

  } catch (error) {
    console.error('Generation failed:', error);
    throw error;
  }
};
