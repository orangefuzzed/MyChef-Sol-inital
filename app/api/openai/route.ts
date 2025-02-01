import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';  // <-- fix here
import { authOptions } from '@/lib/auth';
import axios from 'axios';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_MODEL_NAME = 'gpt-4o-mini'; // Example name

function generatePrompt(message: string, requestType: string) {
  let corePrompt = `
    You are a world-class culinary AI, known for imaginative recipes, fresh takes on cooking, adventurous flavors and playful spins on classic dishes.
    You speak with warmth and encouragement. 
    You carefully consider any user preferences or dietary restrictions—when provided.
    When no preferences exist, feel free to be wildly creative, innovative and unexpected.
  `;

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
    corePrompt += `
    Now, respond to the user's request:
    ${message}.
    `;
  }

  return corePrompt.trim();
}

export async function POST(request: Request) {
  try {
    // 1. Check if user is authenticated
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse JSON body
    const { message, requestType } = await request.json();
    console.log('Received message:', message.slice(0, 100) + '...');

    // 3. Generate the prompt
    const prompt = generatePrompt(message, requestType);

    // 4. Construct messages array for the Chat Completion API
    const messages = [
      {
        role: 'system',
        content: `You are a helpful AI specialized in recipes and meal planning. 
                  Please follow the user’s instructions carefully and respond with clarity.`,
      },
      {
        role: 'user',
        content: prompt,
      },
    ];

    // 5. Call OpenAI
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: OPENAI_MODEL_NAME,
        messages,
        max_tokens: 7168,
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    console.log('OpenAI API response status:', response.status);

    // 6. Extract reply
    const reply = response.data.choices?.[0]?.message?.content || '';
    console.log('OpenAI reply (truncated):', reply.slice(0, 200) + '...');

    // 7. Return JSON
    return NextResponse.json({
      status: 'success',
      message: 'OpenAI GPT-4o Mini response received successfully',
      data: { reply },
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
    return NextResponse.json({ status: 'error', message: errorMessage }, { status: 500 });
  }
}
