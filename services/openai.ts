// Safe environment variable access
const getEnvVar = (key: string): string => {
  try {
    return (import.meta.env && import.meta.env[key]) || '';
  } catch {
    return '';
  }
};

const OPENAI_API_KEY = getEnvVar('VITE_OPENAI_API_KEY');

export interface ImageAnalysisResult {
  description: string;
  prompts: string[];
  tags: string[];
}

export const openAIService = {
  async analyzeImage(imageBase64: string): Promise<ImageAnalysisResult> {
    if (!OPENAI_API_KEY) {
      // Return mock data if no API key is configured
      return {
        description: "Mock analysis: A beautiful landscape with mountains and trees in the background.",
        prompts: [
          "A serene mountain landscape with evergreen trees",
          "Nature photography of mountain peaks at sunset",
          "Peaceful outdoor scene with natural lighting"
        ],
        tags: ["landscape", "mountains", "nature", "trees", "scenic"]
      };
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4-vision-preview",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Analyze this image and provide: 1) A detailed description, 2) 3-5 creative prompts for recreating similar images, 3) Relevant tags. Format as JSON with keys: description, prompts (array), tags (array)."
                },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:image/jpeg;base64,${imageBase64}`
                  }
                }
              ]
            }
          ],
          max_tokens: 500
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;
      
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      try {
        return JSON.parse(content);
      } catch {
        // If JSON parsing fails, create structured response
        return {
          description: content,
          prompts: ["Creative prompt based on the analyzed image"],
          tags: ["ai-analyzed", "image"]
        };
      }
    } catch (error) {
      console.error('OpenAI analysis error:', error);
      throw error;
    }
  }
};