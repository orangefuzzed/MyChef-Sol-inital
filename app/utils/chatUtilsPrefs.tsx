// chatUtilsPrefs.tsx

import { ChatMessage } from '../../types/ChatMessage'; // Assuming there's a ChatMessage type defined
import { IUserPreferences } from '../../models/userPreferences'; // Import preferences type

export const handleError = (
  error: unknown,
  setIsLoading: (loading: boolean) => void
) => {
  console.error('An error occurred:', error);
  setIsLoading(false);
};

// Utility to generate prompts for AI interaction
export const generatePromptWithPreferences = (
  conversationHistory: string,
  message: string,
  promptType: string,
  preferences?: IUserPreferences // Include preferences as an optional parameter
): string => {
  // Generate preferences string if preferences exist
  const preferencesString = preferences
    ? `
      User Preferences:
      - Adventure Scale: ${preferences.adventureScale || 'Not set'}
      - Dietary Restrictions: ${preferences.dietaryRestrictions?.join(', ') || 'None'}
      - Cooking Style: ${preferences.cookingStyle?.join(', ') || 'None'}
    `
    : '';

  const commonPromptPart = `
    ${conversationHistory}
    ${preferencesString}
    Human: ${message}
    Assistant:
  `;

  switch (promptType) {
    case 'sendMessage':
      return `
        ${commonPromptPart}
        Please provide 3 recipe suggestions based on the following user input and preferences.
        
        Respond in the following JSON format:
        {
          "message": "A brief conversational and friendly assistant message introducing the suggestions.",
          "recipes": [
            {
              "id": "unique_recipe_id",
              "recipeTitle": "Recipe Title",
              "cookTime": "X min"
              "calories: "X Kcal"
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
        Please generate 4 new and different recipe suggestions for the user's request, taking preferences into account.
  
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

// Parse AI response
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
