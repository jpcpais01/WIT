import axios from 'axios';
import { parseAIResponse } from '../utils/responseParser';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'meta-llama/llama-4-maverick-17b-128e-instruct';

// Convert image to base64
const convertImageToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Identify object using Groq API
export const identifyObject = async (imageFile, additionalText = '') => {
  try {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    
    if (!apiKey) {
      throw new Error('Groq API key not found. Please add VITE_GROQ_API_KEY to your .env file.');
    }

    const base64Image = await convertImageToBase64(imageFile);
    
    const prompt = `You are an expert at identifying objects, animals, plants, food, and anything else in images. 

    CRITICAL: You MUST respond in this EXACT structured format. Do not deviate from this format:

    TITLE: [One concise title identifying the main subject - max 6 words]
    DESCRIPTION: [2-3 sentence detailed description of what you see]
    FEATURES: [3-5 key characteristics, separated by " • "]
    CONTEXT: [Additional background information, interesting facts, or relevant details]
    CONFIDENCE: [High/Medium/Low - your confidence level in this identification]

    ${additionalText ? `Additional context from user: ${additionalText}` : ''}

    Example format:
    TITLE: Golden Retriever Dog
    DESCRIPTION: This is a beautiful golden retriever with a thick, wavy coat and friendly expression. The dog appears to be an adult, sitting in what looks like a well-lit indoor environment.
    FEATURES: Golden wavy coat • Friendly facial expression • Medium to large size • Floppy ears • Well-groomed appearance
    CONTEXT: Golden Retrievers are popular family dogs known for their gentle temperament and intelligence. They were originally bred in Scotland for retrieving waterfowl and are excellent swimmers.
    CONFIDENCE: High

    Analyze the image and respond in this EXACT format only.`;

    const response = await axios.post(
      GROQ_API_URL,
      {
        model: MODEL,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt
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
        max_tokens: 500,
        temperature: 0.3
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const rawResponse = response.data.choices[0].message.content;
    return parseAIResponse(rawResponse);
  } catch (error) {
    console.error('Error identifying object:', error);
    
    if (error.response?.status === 401) {
      throw new Error('Invalid API key. Please check your Groq API key.');
    } else if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.');
    } else if (error.message.includes('API key not found')) {
      throw new Error(error.message);
    } else {
      throw new Error('Failed to identify object. Please try again.');
    }
  }
}; 