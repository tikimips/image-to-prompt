// Safe environment variable access
const getEnvVar = (key: string): string => {
  try {
    return import.meta?.env?.[key] || '';
  } catch (error) {
    console.warn(`Failed to access environment variable ${key}:`, error);
    return '';
  }
};

// OpenAI service for image analysis and prompt generation
export const openaiService = {
  async analyzeImage(imageFile: File) {
    const apiKey = getEnvVar('VITE_OPENAI_API_KEY');
    
    if (!apiKey || apiKey === 'your-openai-api-key') {
      throw new Error('OpenAI API key not configured. Please add VITE_OPENAI_API_KEY to your environment variables.');
    }

    try {
      // Convert image to base64
      const base64Image = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(imageFile);
      });

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4-vision-preview',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Analyze this image and generate a detailed prompt that could be used to recreate it with AI image generation tools. Focus on style, composition, colors, mood, and technical details.'
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: base64Image
                  }
                }
              ]
            }
          ],
          max_tokens: 500
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}. ${errorData.error?.message || ''}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || 'Unable to generate prompt for this image.';
    } catch (error) {
      console.error('OpenAI API error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to analyze image with OpenAI API');
    }
  },

  // Check if OpenAI is configured
  isConfigured() {
    const apiKey = getEnvVar('VITE_OPENAI_API_KEY');
    return !!(apiKey && apiKey !== 'your-openai-api-key' && apiKey.length > 10);
  }
};