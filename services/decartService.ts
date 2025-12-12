import { ComicPanel, Orientation } from '../types';

const API_ENDPOINT = 'https://api.decart.ai/v1/generate/lucy-pro-t2i';

/**
 * Generates an image using the Decart API (Lucy Pro T2I Model).
 * 
 * Note: While the prompt mentions @decartai/sdk, strictly importing it might cause 
 * resolution errors in environments where the package isn't pre-installed. 
 * We adhere to the REST endpoint provided in the description for maximum compatibility.
 */
export const generatePanelImage = async (
  apiKey: string,
  fullPrompt: string,
  orientation: Orientation
): Promise<string> => {
  if (!apiKey) {
    throw new Error('API Key is missing. Please configure your environment.');
  }

  // Map orientation to specific resolutions or aspect ratio instructions if needed
  // The documentation says 'orientation' parameter is supported: 'landscape' | 'portrait'
  
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: fullPrompt,
        resolution: '720p',
        orientation: orientation,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Decart API Error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    // The endpoint typically returns the image binary directly for generation endpoints, 
    // or a JSON with a URL. 
    // Based on typical "generate" endpoints that don't specify JSON return type in headers,
    // we will check the content type.
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        if(data.url) return data.url;
        // Fallback if structure is different
        if(data.image) return `data:image/png;base64,${data.image}`; 
        throw new Error("Unexpected JSON format from API");
    } else {
        // Assume Blob/Image response
        const blob = await response.blob();
        return URL.createObjectURL(blob);
    }

  } catch (error) {
    console.error('Generation failed:', error);
    throw error;
  }
};
