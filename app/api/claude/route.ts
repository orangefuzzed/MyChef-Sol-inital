import { NextResponse } from 'next/server';
import axios from 'axios';

{/*interface UserPreferences {
  [key: string]: string | number | boolean | null;
}*/}

const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages'; // Using the correct endpoint

// Function to generate the core AI prompt based on request type
const generatePrompt = (message: string, requestType: string) => {
  let corePrompt = `
    You are an intelligent, adaptive culinary assistant with expertise across global cuisines and dietary needs.
    
    Core Capabilities:
    1. Personalized Recipe Recommendations
      - Analyze user preferences dynamically
      - Consider dietary restrictions, nutritional goals
      - Balance flavor, nutrition, and preparation complexity
    
    2. Intelligent Meal Planning
      - Create holistic, personalized meal strategies
      - Consider nutritional balance, variety, and user preferences
      - Adapt plans based on user feedback and goals
    
    3. Advanced Cooking Guidance
      - Provide clear, engaging step-by-step instructions
      - Offer real-time cooking tips and substitutions
      - Adjust guidance based on user skill level and kitchen equipment
    
    Communication Principles:
    - Use warm, encouraging language
    - Break down complex cooking techniques simply
    - Anticipate potential user challenges
    - Provide context and culinary education alongside instructions
  `;

  {/*// Optionally, if `preferences` is used
  if (preferences && Object.keys(preferences).length > 0) {
    corePrompt += `
    User preferences to consider:
    ${JSON.stringify(preferences)}.
    `;
  }*/}

  // Adjust prompt based on the type of request
  if (requestType === 'shoppingList') {
    corePrompt += `
    Now, create a shopping list for the following recipe:
    ${message}.
    `;
  } else if (requestType === 'cookMode') {
    corePrompt += `
    Now, guide the user through step-by-step cooking instructions for the following recipe:
    ${message}.
    `;
  } else if (requestType === 'addToMealPlan') {
    corePrompt += `
    Now, add this recipe to the user's meal plan:
    ${message}.
    `;
  } else {
    // Default prompt for general conversation
    corePrompt += `
    Now, respond to the user's request:
    ${message}.
    `;
  }

  return corePrompt;
};


export async function POST(request: Request) {
  try {
    const { message, requestType } = await request.json();

    console.log('Received message:', message.slice(0, 100) + '...');

    // Generate the core prompt using user preferences and requestType
    const prompt = generatePrompt(message, requestType);

    // Send the prompt to Claude API
    const response = await axios.post(
      CLAUDE_API_URL,
      {
        model: "claude-3-5-sonnet-20240620",
        max_tokens: 3072,
        messages: [
          {
            role: "user",
            content: prompt,
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01'
        }
      }
    );

    console.log('Claude API response status:', response.status);
    console.log('Claude API response data:', JSON.stringify(response.data).slice(0, 200) + '...');

    const reply = response.data.content[0].text;

    return NextResponse.json({
      status: 'success',
      message: 'Claude API response received successfully',
      data: { reply }
    });
  } catch (error) {
    let errorMessage = 'Error communicating with Claude';
    if (axios.isAxiosError(error)) {
      if (error.response) {
        errorMessage = `Claude API returned an error: Status: ${error.response.status}, Data: ${JSON.stringify(error.response.data)}`;
      } else if (error.request) {
        errorMessage = 'No response received from Claude API';
      } else {
        errorMessage = `Error in request setup: ${error.message}`;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    console.error('Error in Claude API route:', errorMessage);

    return NextResponse.json({
      status: 'error',
      message: errorMessage
    }, { status: 500 });
  }
}

