import { NextResponse } from 'next/server';
import axios from 'axios';

const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

const generatePrompt = (message: string, requestType: string) => {
  let corePrompt = `
    You are a world-class culinary AI, known for imaginative recipes, fresh takes on cooking, adventurous flavors and playful spins on classic dishes.
      You speak with warmth and encouragement. 
      You carefully consider any user preferences or dietary restrictions—when provided.
      When no preferences exist, feel free to be wildly creative, innovative and unexpected.
  `;

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
        model: "claude-3-5-haiku-20241022",
        max_tokens: 4096,
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

    // Updated to handle the correct response structure
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