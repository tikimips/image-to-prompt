// OpenAI Vision API Service
// To use this service, you'll need to:
// 1. Sign up for an OpenAI account at https://platform.openai.com/
// 2. Generate an API key from your dashboard
// 3. Replace "YOUR_OPENAI_API_KEY_HERE" with your actual API key
// 4. For production, use environment variables instead of hardcoding the key

const OPENAI_API_KEY = "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";
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

export interface OpenAIAnalysisResult {
  prompt: string;
  style: string;
  confidence: number;
}

export class OpenAIVisionService {
  private apiKey: string;
  private lastError: string | null = null;
  private quotaExceeded: boolean = false;
  private consecutiveQuotaErrors: number = 0;
  private lastQuotaErrorTime: number = 0;

  constructor(apiKey: string = OPENAI_API_KEY) {
    this.apiKey = apiKey;
  }

  async analyzeImage(imageBase64: string): Promise<OpenAIAnalysisResult> {
    if (!this.apiKey || this.apiKey === "YOUR_OPENAI_API_KEY_HERE") {
      throw new Error("OpenAI API key not configured. Please add your API key to use this feature.");
    }

    // Validate and process the image
    if (!imageBase64.startsWith('data:image/')) {
      throw new Error("Invalid image format. Expected base64 data URL.");
    }

    // Log image size for debugging
    const imageSizeKB = Math.round((imageBase64.length * 3) / 4) / 1024;
    console.log(`Processing image: ${imageSizeKB}KB`);

    // OpenAI has a 20MB limit, but we'll keep images smaller for better performance
    if (imageSizeKB > 2000) {
      throw new Error("Image too large. Please use an image smaller than 2MB.");
    }

    try {
      console.log("Sending request to OpenAI Vision API...");
      
      const response = await fetch(OPENAI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `Analyze this image and generate a detailed AI art prompt that would recreate a similar image. The prompt should include:

1. Subject/content description
2. Art style and medium
3. Lighting and mood
4. Color palette
5. Composition and framing
6. Technical details (camera settings, etc. if applicable)

Format your response as a single, comprehensive prompt that an AI image generator could use. Be specific about artistic techniques, lighting conditions, and visual style. Keep it under 200 words but make it detailed and evocative.

Also, identify the primary artistic style (e.g., photorealistic, digital art, watercolor, oil painting, sketch, etc.) - respond with just the style name at the end after "STYLE:"`
                },
                {
                  type: "image_url",
                  image_url: {
                    url: imageBase64,
                    detail: "high"
                  },
                },
              ],
            },
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        // Handle specific error cases
        if (response.status === 429) {
          this.quotaExceeded = true;
          this.consecutiveQuotaErrors++;
          this.lastQuotaErrorTime = Date.now();
          
          throw new Error(
            `QUOTA_EXCEEDED: You have exceeded your OpenAI API quota. Please check your billing details at https://platform.openai.com/account/billing`
          );
        }
        
        throw new Error(
          `OpenAI API error: ${response.status} ${response.statusText}. ${
            errorData.error?.message || "Unknown error"
          }`
        );
      }

      const data = await response.json();
      console.log("OpenAI API response received:", data);
      
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        console.error("No content in OpenAI response:", data);
        throw new Error("No response content from OpenAI API");
      }

      console.log("OpenAI response content:", content);

      // Parse the response to extract prompt and style
      const lines = content.split('\n');
      const styleLine = lines.find(line => line.startsWith('STYLE:'));
      const style = styleLine ? styleLine.replace('STYLE:', '').trim() : 'unknown';
      
      // Remove the style line from the prompt
      const prompt = lines
        .filter(line => !line.startsWith('STYLE:'))
        .join('\n')
        .trim();

      if (!prompt) {
        throw new Error("Generated prompt is empty");
      }

      const result = {
        prompt,
        style: style.toLowerCase(),
        confidence: 0.85, // Mock confidence score
      };

      console.log("Parsed result:", result);
      return result;
    } catch (error) {
      this.lastError = error instanceof Error ? error.message : 'Unknown error';
      
      // Don't log quota exceeded as an error since it's expected, and reduce noise for repeated errors
      if (this.lastError.includes('QUOTA_EXCEEDED')) {
        // Only log the first few quota errors to reduce console noise
        if (this.consecutiveQuotaErrors <= 2) {
          console.warn(`OpenAI API quota exceeded (${this.consecutiveQuotaErrors}x) - falling back to demo mode`);
        }
      } else {
        console.error("OpenAI Vision API error:", error);
        if (this.consecutiveQuotaErrors <= 1) { // Only log details for the first few errors
          console.error("Error details:", {
            message: this.lastError,
            type: typeof error,
            stack: error instanceof Error ? error.stack : 'No stack trace'
          });
        }
      }
      
      throw error;
    }
  }

  // Test method to verify API key is working (simplified request)
  async testApiConnection(): Promise<boolean> {
    if (!this.apiKey || this.apiKey === "YOUR_OPENAI_API_KEY_HERE") {
      return false;
    }

    try {
      const response = await fetch(OPENAI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "user",
              content: "Say 'API test successful' if you can read this."
            }
          ],
          max_tokens: 10,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.choices?.[0]?.message?.content?.includes('successful') || false;
      }
      return false;
    } catch {
      return false;
    }
  }

  // Improved demo mode that tries to provide more relevant prompts
  async generateMockPrompt(imageBase64?: string): Promise<OpenAIAnalysisResult> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // If we have an image, try to do some basic analysis
    if (imageBase64) {
      try {
        const analysisResult = await this.performBasicImageAnalysis(imageBase64);
        if (analysisResult) {
          return analysisResult;
        }
      } catch (error) {
        console.warn('Basic image analysis failed, falling back to random prompt:', error);
      }
    }

    // Fallback to random prompts
    const mockPrompts = [
      {
        prompt: "A photorealistic portrait captured in natural daylight, featuring warm golden hour lighting with soft shadows. High detail facial features, professional photography composition with shallow depth of field creating beautiful bokeh background. Shot with a 85mm lens, warm color temperature around 3200K, slight vignetting effect.",
        style: "photorealistic",
        confidence: 0.72
      },
      {
        prompt: "Digital art illustration with vibrant saturated colors and fantasy elements. Detailed character design with dynamic poses, dramatic cinematic lighting with strong contrast between light and shadow. Concept art style with clean lines and professional digital painting techniques.",
        style: "digital art",
        confidence: 0.68
      },
      {
        prompt: "Minimalist composition featuring clean geometric lines and negative space. Soft ambient lighting with subtle shadows, modern aesthetic with limited color palette of whites, grays, and one accent color. Contemporary design with elegant simplicity and balanced proportions.",
        style: "minimalist",
        confidence: 0.65
      },
      {
        prompt: "Vintage film photography with natural grain texture and slightly desaturated colors. Classic composition following rule of thirds, nostalgic atmosphere with warm sepia undertones. Shot on analog film camera with natural imperfections and authentic vintage character.",
        style: "vintage",
        confidence: 0.67
      },
      {
        prompt: "Abstract geometric composition with bold primary colors arranged in rectangular blocks. Clean black lines dividing colored sections, minimalist modern art style reminiscent of Mondrian paintings. Flat color application with precise edges, contemporary abstract expressionism with balanced asymmetrical composition.",
        style: "abstract",
        confidence: 0.63
      }
    ];

    return mockPrompts[Math.floor(Math.random() * mockPrompts.length)];
  }

  // Basic image analysis without API calls
  private async performBasicImageAnalysis(imageBase64: string): Promise<OpenAIAnalysisResult | null> {
    return new Promise((resolve) => {
      try {
        const img = new Image();
        img.onload = () => {
          // Create a canvas to analyze the image
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(null);
            return;
          }

          // Set canvas size to a smaller version for analysis
          canvas.width = 100;
          canvas.height = 100;
          ctx.drawImage(img, 0, 0, 100, 100);

          // Get image data for analysis
          const imageData = ctx.getImageData(0, 0, 100, 100);
          const data = imageData.data;

          // Analyze colors and patterns
          const analysis = this.analyzeImageData(data);
          resolve(this.generatePromptFromAnalysis(analysis));
        };
        img.onerror = () => resolve(null);
        img.src = imageBase64;
      } catch (error) {
        resolve(null);
      }
    });
  }

  private analyzeImageData(data: Uint8ClampedArray) {
    let totalR = 0, totalG = 0, totalB = 0;
    let colorVariance = 0;
    let edgeCount = 0;
    const colorCounts: {[key: string]: number} = {};
    
    // Analyze pixels
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      totalR += r;
      totalG += g;
      totalB += b;
      
      // Count dominant colors (simplified)
      const colorKey = `${Math.floor(r/32)}-${Math.floor(g/32)}-${Math.floor(b/32)}`;
      colorCounts[colorKey] = (colorCounts[colorKey] || 0) + 1;
      
      // Simple edge detection (check difference with next pixel)
      if (i + 4 < data.length) {
        const nextR = data[i + 4];
        const diff = Math.abs(r - nextR);
        if (diff > 30) edgeCount++;
      }
    }

    const pixelCount = data.length / 4;
    const avgR = totalR / pixelCount;
    const avgG = totalG / pixelCount;
    const avgB = totalB / pixelCount;
    
    // Calculate color variance
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      colorVariance += Math.pow(r - avgR, 2) + Math.pow(g - avgG, 2) + Math.pow(b - avgB, 2);
    }
    colorVariance /= pixelCount;

    const colorCount = Object.keys(colorCounts).length;
    const hasHighContrast = edgeCount > pixelCount * 0.1;
    const isColorful = colorVariance > 2000;
    const hasLimitedPalette = colorCount < 20;

    return {
      avgColor: { r: avgR, g: avgG, b: avgB },
      colorVariance,
      edgeCount,
      colorCount,
      hasHighContrast,
      isColorful,
      hasLimitedPalette,
      isDark: (avgR + avgG + avgB) / 3 < 128,
      isGeometric: hasHighContrast && hasLimitedPalette
    };
  }

  private generatePromptFromAnalysis(analysis: any): OpenAIAnalysisResult {
    let prompt = "";
    let style = "unknown";
    let confidence = 0.45; // Lower confidence for demo analysis

    // Geometric/abstract detection
    if (analysis.isGeometric && analysis.hasLimitedPalette) {
      prompt = "Abstract geometric composition with bold primary colors and clean lines. Rectangular shapes arranged in grid-like pattern with strong contrasts. Modern minimalist art style with flat color application and precise geometric forms. Contemporary abstract expressionism reminiscent of De Stijl movement, featuring balanced asymmetrical composition with primary color palette.";
      style = "abstract";
      confidence = 0.72;
    }
    // High contrast, limited colors - might be graphic design
    else if (analysis.hasHighContrast && analysis.hasLimitedPalette && !analysis.isDark) {
      prompt = "Clean graphic design with bold contrasting elements and limited color palette. Modern minimalist aesthetic with geometric shapes and clear visual hierarchy. Professional digital design with flat colors and crisp edges, contemporary style with balanced composition.";
      style = "digital art";
      confidence = 0.68;
    }
    // Dark image
    else if (analysis.isDark) {
      prompt = "Moody atmospheric composition with deep shadows and dramatic lighting. Dark aesthetic with subtle highlights creating depth and mystery. Professional photography or digital art with emphasis on contrast and mood, cinematic quality with rich black tones.";
      style = "photorealistic";
      confidence = 0.65;
    }
    // Colorful image
    else if (analysis.isColorful) {
      prompt = "Vibrant composition with rich saturated colors and dynamic visual energy. Artistic illustration with bold color palette and expressive brushwork. Contemporary digital art style with painterly qualities, featuring strong color relationships and artistic flair.";
      style = "digital art";
      confidence = 0.70;
    }
    // Default fallback
    else {
      prompt = "Contemporary artistic composition with balanced elements and thoughtful color usage. Modern aesthetic with clean presentation and professional execution. Artistic style with attention to visual harmony and compositional strength.";
      style = "digital art";
      confidence = 0.50;
    }

    return { prompt, style, confidence };
  }

  // Check if API key is properly configured
  isConfigured(): boolean {
    return this.apiKey && this.apiKey !== "YOUR_OPENAI_API_KEY_HERE";
  }

  // Check if the last error was due to quota exceeded
  hasQuotaError(): boolean {
    return this.lastError?.includes('QUOTA_EXCEEDED') || false;
  }

  // Get the last error message
  getLastError(): string | null {
    return this.lastError;
  }

  // Clear the last error
  clearError(): void {
    this.lastError = null;
    this.quotaExceeded = false;
    this.consecutiveQuotaErrors = 0;
    this.lastQuotaErrorTime = 0;
  }

  // Check if we should skip API calls due to quota
  shouldSkipApi(): boolean {
    // If we've had recent quota errors, skip API calls for a while
    if (this.quotaExceeded && this.consecutiveQuotaErrors >= 3) {
      const timeSinceLastError = Date.now() - this.lastQuotaErrorTime;
      const cooldownPeriod = 60000; // 1 minute cooldown
      return timeSinceLastError < cooldownPeriod;
    }
    return this.quotaExceeded;
  }
}

// Export a default instance
export const openAIService = new OpenAIVisionService();