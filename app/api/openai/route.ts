// app/api/openai/route.ts

import { NextResponse } from 'next/server';
import axios from 'axios';

// Replace with your OpenAI key and the model name for GPT-4o Mini
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_MODEL_NAME = 'gpt-4o-mini';
// (Example name; verify correct naming with OpenAI docs or your dev console)

const generatePrompt = (message: string, requestType: string) => {
  // Reuse your existing "corePrompt" from the openai route
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

  return corePrompt.trim();
};

export async function POST(request: Request) {
  try {
    // 1. Parse the incoming JSON
    const { message, requestType } = await request.json();
    console.log('Received message:', message.slice(0, 100) + '...');

    // 2. Generate the prompt
    const prompt = generatePrompt(message, requestType);

    // 3. Construct the messages array for the OpenAI Chat Completion API
    // We’ll pass the “system” or “user” messages as needed.
    // For simplicity, we’ll do a single user message with all instructions:
    const messages = [
      {
        role: 'system',
        content: `You are a helpful AI specialized in recipes and meal planning. 
                  Please follow the user’s instructions carefully and respond with clarity.`
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    // 4. Call the OpenAI API
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: OPENAI_MODEL_NAME,  // e.g. "gpt-4o-mini-2024-07-18"
        messages: messages,
        max_tokens: 7168,    // Adjust as needed
        temperature: 0.7,    // Adjust as needed
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`
        }
      }
    );

    console.log('OpenAI API response status:', response.status);

    // 5. Extract the reply from OpenAI’s response structure
    // Typical shape: data.choices[0].message.content
    const reply = response.data.choices?.[0]?.message?.content || '';

    console.log('OpenAI reply (truncated):', reply.slice(0, 200) + '...');

    // 6. Return the JSON response
    return NextResponse.json({
      status: 'success',
      message: 'OpenAI GPT-4o Mini response received successfully',
      data: { reply }
    });

  } catch (error) {
    let errorMessage = 'Error communicating with OpenAI GPT-4o Mini';
    if (axios.isAxiosError(error)) {
      if (error.response) {
        errorMessage = `OpenAI API returned an error: Status: ${error.response.status}, Data: ${JSON.stringify(error.response.data)}`;
      } else if (error.request) {
        errorMessage = 'No response received from OpenAI API';
      } else {
        errorMessage = `Error in request setup: ${error.message}`;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    console.error('Error in OpenAI route:', errorMessage);

    return NextResponse.json({
      status: 'error',
      message: errorMessage
    }, { status: 500 });
  }
}
