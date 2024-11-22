import axios from 'axios';
import { UserPreferencesInterface } from '@/types/interfaces';
import { Recipe } from '../../types/Recipe';

export const sendMessageToClaude = async (
  message: string,
  requestType: string,
  preferences?: UserPreferencesInterface
): Promise<string> => {
  try {
    console.log('Sending message to API route:', message.slice(0, 100) + '...');

    const startTime = Date.now();

    // Send the message, preferences, and requestType to the /api/claude API route
    const response = await axios.post('/api/claude', { message, preferences, requestType });
    
    // Log the full response before attempting to parse
    console.log('Full response from Claude:', response.data);

    const endTime = Date.now();
    console.log(`Claude response received in ${endTime - startTime}ms`);

    // Update to match the actual response structure
    if (!response.data || !response.data.data || !response.data.data.reply) {
      throw new Error('Invalid response structure from Claude API');
    }

    console.log('Claude response length:', response.data.data.reply.length);

    // Return the reply from the API route
    return response.data.data.reply;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error communicating with Claude:', error.response?.data || error.message);
    } else {
      console.error('Error communicating with Claude:', (error as Error).message);
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

    console.log('Recipe saved successfully to MongoDB');
  } catch (error) {
    console.error('Error saving recipe to MongoDB:', error);
  }
};
