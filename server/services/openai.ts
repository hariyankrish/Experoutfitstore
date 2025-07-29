import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_KEY 
});

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function chatWithAI(messages: ChatMessage[]): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    return response.choices[0].message.content || "I'm sorry, I couldn't process that request.";
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to get AI response");
  }
}

export async function generateProductRecommendations(userQuery: string, products: any[]): Promise<{
  recommendations: string[],
  explanation: string
}> {
  try {
    const productNames = products.map(p => p.name).join(", ");
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a helpful fashion assistant for EXPEROUTFIT, a custom streetwear brand. 
          Help customers find the perfect products based on their needs. 
          Available products: ${productNames}
          Respond with JSON in this format: { "recommendations": ["product1", "product2"], "explanation": "why these products match" }`
        },
        {
          role: "user",
          content: userQuery
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return {
      recommendations: result.recommendations || [],
      explanation: result.explanation || "These products match your style preferences."
    };
  } catch (error) {
    console.error("Product recommendation error:", error);
    return {
      recommendations: [],
      explanation: "I'm having trouble processing recommendations right now."
    };
  }
}

export async function analyzeDesignImage(base64Image: string): Promise<{
  description: string,
  suggestedImprovements: string[],
  colorPalette: string[]
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Analyze this design image for a custom apparel piece. Provide feedback on the design, 
          suggest improvements, and extract the main color palette. 
          Respond with JSON: { "description": "", "suggestedImprovements": [], "colorPalette": [] }`
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Please analyze this design for custom apparel printing"
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ],
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 500,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return {
      description: result.description || "Unable to analyze the design",
      suggestedImprovements: result.suggestedImprovements || [],
      colorPalette: result.colorPalette || []
    };
  } catch (error) {
    console.error("Design analysis error:", error);
    return {
      description: "Unable to analyze the design at this time",
      suggestedImprovements: [],
      colorPalette: []
    };
  }
}

export async function generateCustomDesignIdeas(prompt: string): Promise<{
  ideas: string[],
  techniques: string[]
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a creative design assistant for custom streetwear. Generate design ideas and printing techniques 
          based on user prompts. Focus on streetwear aesthetics, bold graphics, and modern trends.
          Respond with JSON: { "ideas": ["idea1", "idea2"], "techniques": ["technique1", "technique2"] }`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return {
      ideas: result.ideas || [],
      techniques: result.techniques || []
    };
  } catch (error) {
    console.error("Design generation error:", error);
    return {
      ideas: ["Try bold typography with geometric shapes", "Consider abstract art with vibrant colors"],
      techniques: ["Screen printing", "Heat transfer vinyl"]
    };
  }
}
