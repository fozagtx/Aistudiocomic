import { createDecartClient, models } from "@decartai/sdk";
import { Orientation } from '../types';

const API_KEY = 'comic-2_zqsavxzUnoDAxNIyEBzpIIiehKhJBIylsBumvIBbnwYgnGvFCWTAnUycbYuutemi';

const client = createDecartClient({
  apiKey: API_KEY
});

/**
 * Generates an image using the Decart SDK (Lucy Pro T2I Model).
 */
export const generatePanelImage = async (
  _apiKey: string,
  fullPrompt: string,
  orientation: Orientation
): Promise<string> => {

  try {
    console.log('Decart SDK Request:', { prompt: fullPrompt, orientation });

    const result = await client.process({
      model: models.image("lucy-pro-t2i"),
      prompt: fullPrompt,
    });

    console.log('Decart SDK Response:', result);

    // Return the image URL from the result
    if (result && result.url) {
      return result.url;
    }

    if (result && result.image) {
      return `data:image/png;base64,${result.image}`;
    }

    throw new Error("No image URL in response");

  } catch (error) {
    console.error('Generation failed:', error);
    throw error;
  }
};
