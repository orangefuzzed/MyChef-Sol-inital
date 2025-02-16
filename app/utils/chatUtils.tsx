// OpenAIChatUtils.tsx

import { ChatMessage } from '../../types/ChatMessage';
import { Preferences } from '../contexts/PreferencesContext';

/**
 * Handle any caught errors and reset loading state.
 */
export const handleError = (
  error: unknown,
  setIsLoading: (loading: boolean) => void
) => {
  console.error('An error occurred:', error);
  setIsLoading(false);
};

/**
 * Generate a prompt specifically for OpenAI GPT-4o Mini,
 * referencing user preferences if needed.
 */
export const generatePrompt = (
  conversationHistory: string,
  message: string,
  promptType: string,
  preferences: Preferences,
  isPreferencesActive: boolean
): string => {
  // If preferences are toggled on, we include them in the prompt:
  const generatePreferencesSummary = (preferences: Preferences): string => {
    return `
    Hey GPT-4o Mini! Here’s what you need to know about me:
    - Dietary Restrictions: ${preferences.dietaryRestrictions?.join(', ') || 'None'}
    - Schedule: ${preferences.schedule?.join(', ') || 'None'}
    - Pantry Ingredients: ${preferences.ingredients?.join(', ') || 'None'}
    - Cooking Style: ${preferences.cookingStyle?.join(', ') || 'None'}
    - I live in:
      - Country: ${preferences.location?.country || 'Not specified'}
      - Measurement System: ${preferences.location?.measurementSystem || 'Not specified'}
      - High Altitude Adjustment: ${preferences.location?.highAltitude || 'Not specified'}

    Now, based on this, can you suggest a recipe for ${message}? Please make it mouthwatering, awesome and helpful!!
    `;
  };

  // If preferences are not active, we use a simpler prompt:
  const generateNoPreferencesPrompt = (message: string) => {
    return `
      Hey GPT-4o Mini! I’m looking for some culinary inspiration today.
      Here’s my request: 
      "${message}"
      
      What can you whip up that’ll blow me away? Thanks in advance, chef! 🧑‍🍳
    `;
  };

  // Decide which “intro” block to use:
  const preferencesPart = isPreferencesActive
    ? generatePreferencesSummary(preferences)
    : generateNoPreferencesPrompt(message);

  // Common chunk for conversation context + preference block:
  const commonPromptPart = `
    ${conversationHistory}
    ${preferencesPart}
    Assistant:
  `;

  /**
   * Prompt instructions vary by promptType.
   * Keep JSON structure & instructions consistent with your existing code.
   */
  switch (promptType) {
    case 'sendMessage':
      return `
        ${commonPromptPart}
        Please provide 4 recipe suggestions based on the user input.

        Respond in the following JSON format:
        {
          "message": "A brief conversational and friendly assistant message introducing the suggestions. Feel free to use a humorous style, add puns or witty remarks.",
          "recipes": [
            {
              "id": "Use the recipeTitle in snake_case, plus a random 5 digit numer to guarantee uniqueness.",
              "recipeTitle": "Recipe Title",
              "cookTime": "X min",
              "calories": "X Kcal",
              "protein": "X g",
              "carbs": "X g",
              "rating": "★★★★☆",
              "description": "Brief description",
              "ingredients": ["Ingredient 1", "Ingredient 2"],
              "instructions": ["Step 1", "Step 2"]
            }
          ]
        }

        Please respond in valid JSON only. **No** triple backticks, code fences, or additional commentary outside the JSON object. Ensure your response is strictly parseable by JSON.parse().
        Also, Please answer with your best recipe ideas, using a fun and imaginative style. Please include one classic or traditional recipe, but also feel free to incorporate unique ingredients or unexpected twists, unless the user's preferences forbid them. Let your creativity shine! Also, please ensure that the instructions include the amount of the ingredient in each of the steps.
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

/**
 * Format the conversation history into a simple transcript,
 * labeling user vs. assistant messages.
 */
export const formatConversationHistory = (messages: ChatMessage[]): string => {
  return messages
    .map((msg) => `${msg.sender === 'user' ? 'Human' : 'Assistant'}: ${msg.text}`)
    .join('\n');
};

/**
 * Attempt to parse the AI’s JSON response. If it fails,
 * we throw an error referencing the OpenAI GPT-4o Mini output.
 */
export const parseAIResponse = (aiResponse: string) => {
  try {
    const parsedResponse = JSON.parse(aiResponse);

    if (
      !parsedResponse ||
      typeof parsedResponse !== 'object' ||
      !parsedResponse.message ||
      !Array.isArray(parsedResponse.recipes)
    ) {
      throw new Error('Invalid response structure from OpenAI GPT-4o Mini');
    }

    return parsedResponse;
  } catch (error) {
    console.error('Failed to parse AI response:', aiResponse);
    throw new Error('Invalid response structure from OpenAI GPT-4o Mini');
  }
};
