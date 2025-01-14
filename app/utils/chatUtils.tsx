// chatUtils.tsx

import { ChatMessage } from '../../types/ChatMessage'; // Assuming there's a ChatMessage type defined
import { Preferences } from '../contexts/PreferencesContext'; // Import Preferences directly


export const handleError = (
  error: unknown,
  setIsLoading: (loading: boolean) => void
) => {
  console.error('An error occurred:', error);
  setIsLoading(false);
};

// Utility to generate prompts for AI interaction
export const generatePrompt = (
  conversationHistory: string,
  message: string,
  promptType: string,
  preferences: Preferences, // Use the Preferences type here
  isPreferencesActive: boolean // Include toggle state
): string => {
  // Helper to generate the conversational preferences summary
  const generatePreferencesSummary = (preferences: Preferences): string => {
    return `
    Hey Claude! Here’s what you need to know about me: 
    - Dietary Restrictions: ${preferences.dietaryRestrictions?.join(', ') || 'None'}
    - Schedule: ${preferences.schedule?.join(', ') || 'None'}
    - Pantry Ingredients: ${preferences.ingredients?.join(', ') || 'None'}
    - Cooking Style: ${preferences.cookingStyle?.join(', ') || 'None'}
    - I live in: 
      - Country: ${preferences.location?.country || 'Not specified'}
      - Measurement System: ${preferences.location?.measurementSystem || 'Not specified'}
      - High Altitude Adjustment: ${preferences.location?.highAltitude || 'Not specified'}

     Now, based on this info, can you suggest a recipe for "${message}"? 
    Please make it mouthwatering and helpful!
    `;
  };

  // Helper to generate the no-preferences version of the prompt
  const generateNoPreferencesPrompt = (message: string) => {
    return `
      Hey Claude! I’m looking for some culinary inspiration today. Here’s my request: 
      "${message}"
      
      What can you whip up that’ll blow me away? Thanks in advance, chef! 🧑‍🍳
    `;
  };

  // Determine which prompt to use based on preferences toggle
  const preferencesPart = isPreferencesActive
    ? generatePreferencesSummary(preferences)
    : generateNoPreferencesPrompt(message);

  const commonPromptPart = `
    ${conversationHistory}
    ${preferencesPart}
    Assistant:
  `;

  // Prompt type handling
  switch (promptType) {
    case 'sendMessage':
      return `
        ${commonPromptPart}
        Please provide 3 recipe suggestions based on the user input.

        Respond in the following JSON format:
        {
          "message": "A brief conversational and friendly assistant message introducing the suggestions. Feel free to use a humorous style, add puns or witty remarks.",
          "recipes": [
            {
              "id": "unique_recipe_id",
              "recipeTitle": "Recipe Title",
              "cookTime": "X min",
              "calories": "X Kcal",
              "protein": "X g",
              "rating": "★★★★☆",
              "description": "Brief description",
              "ingredients": ["Ingredient 1", "Ingredient 2"],
              "instructions": ["Step 1", "Step 2"]
            }
          ]
        }

        Ensure the response is valid JSON with no additional text or commentary outside of the JSON structure. Also ensure that the instructions include the amount of the ingredient in each of the steps.
      `;
    case 'regenerateResponse':
      return `
        ${commonPromptPart}
        Please generate 4 new and different recipe suggestions for the user's request.

        Respond in the same JSON format as before.
      `;
    case 'continueResponse':
      return `
        ${message}
        Please continue from where you left off.
      `;
    default:
      return '';
  }
};

// Utility to format conversation history
export const formatConversationHistory = (messages: ChatMessage[]): string => {
  return messages
    .map((msg) => `${msg.sender === 'user' ? 'Human' : 'Assistant'}: ${msg.text}`)
    .join('\n');
};

export const parseAIResponse = (aiResponse: string) => {
  try {
    const parsedResponse = JSON.parse(aiResponse);

    if (
      !parsedResponse ||
      typeof parsedResponse !== 'object' ||
      !parsedResponse.message ||
      !Array.isArray(parsedResponse.recipes)
    ) {
      throw new Error('Invalid response structure from Claude API');
    }

    return parsedResponse;
  } catch (error) {
    console.error('Failed to parse AI response:', aiResponse);
    throw new Error('Invalid response structure from Claude API');
  }
};
