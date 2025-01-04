// chatUtils.tsx

import { ChatMessage } from '../../types/ChatMessage'; // Assuming there's a ChatMessage type defined
import { PreferencesContextType } from '../contexts/PreferencesContext'; // Import PreferencesContext

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
  preferences: PreferencesContextType['preferences'], // Include preferences
  isPreferencesActive: boolean // Include toggle state
): string => {
  const preferencesPart = isPreferencesActive
    ? `
      User Preferences:
      - Schedule: ${preferences.schedule?.join(', ') || 'None'}
      - Pantry Ingredients: ${preferences.ingredients?.join(', ') || 'None'}
      - Dietary Restrictions: ${preferences.dietaryRestrictions?.join(', ') || 'None'}
      - Cooking Style: ${preferences.cookingStyle?.join(', ') || 'None'}
    `
    : ''; // Add preferences only if toggle is active

  const commonPromptPart = `
    ${conversationHistory}
    Human: ${message}
    ${preferencesPart} <!-- Add preferences if active -->
    Assistant:
  `;

  switch (promptType) {
    case 'sendMessage':
      return `
        ${commonPromptPart}
        Please provide 3 recipe suggestions based on the following user input.

        Respond in the following JSON format:
        {
          "message": "A brief conversational and friendly assistant message introducing the suggestions.",
          "recipes": [
            {
              "id": "unique_recipe_id",
              "recipeTitle": "Recipe Title",
              "cookTime": "X min"
              "calories": "X Kcal"
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
