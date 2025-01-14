// app/services/openaiService.ts

import axios from 'axios';
import { UserPreferencesInterface } from '@/types/interfaces';
import { Recipe } from '../../types/Recipe';

export const sendMessageToOpenai = async (
  message: string,
  requestType: string,
  preferences?: UserPreferencesInterface
): Promise<string> => {
  try {
    console.log('Sending message to OpenAI route:', message.slice(0, 100) + '...');

    const startTime = Date.now();

    // Send the message, preferences, and requestType to the /api/openai API route
    const response = await axios.post('/api/openai', { message, preferences, requestType });

    // Log the full response before parsing
    console.log('Full response from OpenAI:', response.data);

    const endTime = Date.now();
    console.log(`OpenAI GPT-4o Mini response received in ${endTime - startTime}ms`);

    // Validate the response structure
    if (!response.data || !response.data.data || !response.data.data.reply) {
      throw new Error('Invalid response structure from OpenAI GPT-4o Mini API');
    }

    console.log('OpenAI GPT-4o Mini response length:', response.data.data.reply.length);

    // Return the reply from the API route
    return response.data.data.reply;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error communicating with OpenAI GPT-4o Mini:', error.response?.data || error.message);
    } else {
      console.error('Error communicating with OpenAI GPT-4o Mini:', (error as Error).message);
    }
    throw error;
  }
};

export const saveRecipeToDatabase = async (recipe: Recipe) => {
  try {
    const response = await fetch('/api/recipes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ recipe }),
    });

    if (!response.ok) {
      throw new Error('Failed to save recipe to database');
    }

    console.log('Recipe saved successfully to MongoDB (OpenAI flow)');
  } catch (error) {
    console.error('Error saving recipe to MongoDB (OpenAI flow):', error);
  }
};
