// app/utils/OpenAIChatHandlers.ts

import { useChat, ChatMessage } from '../contexts/ChatContext';
import { useRecipeContext } from '../contexts/RecipeContext';
import { sendMessageToOpenai, saveRecipeToDatabase } from '../services/openaiService'; 
import { handleError, generatePrompt, formatConversationHistory, parseAIResponse } from '../utils/chatUtils';
import { saveChatMessageToDB, getLastUserMessageObjectFromDB } from '../utils/indexedDBUtils';
import { Recipe } from '../../types/Recipe';

/**
 * This hook replicates the logic from AIChatHandlers.ts but calls OpenAI instead of Claude.
 */
export const useOpenAIChatHandlers = () => {
  const {
    messages,
    addMessage,
    setMessages,
    setIsLoading,
    lastAIResponse,
    setLastAIResponse,
    sessionId,
  } = useChat();

  const { addRecipeSuggestionSet } = useRecipeContext();

  const handleSendMessage = async (
    inputMessage: string,
    preferences: any,     // Pass user preferences
    isPreferencesActive: boolean // Pass the toggle state
  ) => {
    if (!inputMessage || inputMessage.trim() === '') return;

    setIsLoading(true);

    try {
      const newSessionId = sessionId ?? Date.now().toString();

      // Create a new user message
      const newMessage: ChatMessage = {
        id: Date.now(),
        messageId: Date.now().toString(),
        sessionId: newSessionId,
        timestamp: new Date(),
        sender: 'user',
        text: inputMessage,
      };

      addMessage(newMessage);
      await saveChatMessageToDB(newMessage);

      // Format conversation history for context
      const conversationHistory = formatConversationHistory(messages);

      // Generate prompt with or without preferences
      const fullPrompt = generatePrompt(
        conversationHistory,
        inputMessage,
        'sendMessage',
        preferences,
        isPreferencesActive
      );

      // Send prompt to OpenAI (instead of Claude)
      const aiResponse = await sendMessageToOpenai(fullPrompt, 'recipe suggestions');
      const parsedResponse = parseAIResponse(aiResponse);

      const aiMessage: ChatMessage & { suggestions?: Recipe[] } = {
        id: Date.now() + 1,
        messageId: (Date.now() + 1).toString(),
        sessionId: newSessionId,
        timestamp: new Date(),
        sender: 'ai',
        text: parsedResponse.message,
        suggestions: parsedResponse.recipes,
      };

      addMessage(aiMessage);
      setLastAIResponse(aiMessage);
      await saveChatMessageToDB(aiMessage);

      // If we got any recipe suggestions, store them
      if (parsedResponse.recipes) {
        addRecipeSuggestionSet({
          responseId: aiMessage.messageId,
          message: parsedResponse.message,
          suggestions: parsedResponse.recipes,
        });
        // Also save each recipe to DB
        for (const recipe of parsedResponse.recipes) {
          await saveRecipeToDatabase(recipe);
        }
      }
    } catch (error) {
      console.error('Error during handleSendMessage (OpenAI):', error);

      const errorMessage: ChatMessage = {
        id: Date.now(),
        messageId: Date.now().toString(),
        sessionId: sessionId ?? 'unknown',
        timestamp: new Date(),
        sender: 'system',
        text: 'Oops! The chef is having trouble in the kitchen. Let’s try that again in a moment.',
      };

      setMessages((prevMessages: ChatMessage[]) => [...prevMessages, errorMessage]);
      setLastAIResponse(errorMessage);
      handleError(error, setIsLoading);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerateResponse = async () => {
    if (!lastAIResponse || !sessionId) return;

    setIsLoading(true);

    try {
      const conversationHistory = formatConversationHistory(messages);
      const regeneratePrompt = `
        ${conversationHistory}
        Assistant:

        Please provide 3 additional recipe suggestions, ensuring they are unique, varied, 
        and avoid duplicating previous suggestions.

        Respond in valid JSON:
        {
          "message": "A brief conversational and friendly assistant message introducing the suggestions. Feel free to use a humorous style, add puns or witty remarks.",
          "recipes": [
            {
              "id": "unique_recipe_id",
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
          Also, Please answer with your best recipe ideas, using a fun and imaginative style. Feel free to incorporate unique ingredients or unexpected twists, unless the user's preferences forbid them. Let your creativity shine! Also, please ensure that the instructions include the amount of the ingredient in each of the steps.
      `;

      const aiResponse = await sendMessageToOpenai(regeneratePrompt, 'get more suggestions');
      const parsedResponse = parseAIResponse(aiResponse);

      if (!parsedResponse || !parsedResponse.recipes) {
        throw new Error('Invalid response structure from OpenAI GPT-4o Mini');
      }

      const regenerateMessage: ChatMessage = {
        id: Date.now(),
        messageId: Date.now().toString(),
        sessionId,
        timestamp: new Date(),
        sender: 'ai',
        text: parsedResponse.message,
      };

      addMessage(regenerateMessage);
      setLastAIResponse(regenerateMessage);

      addRecipeSuggestionSet({
        responseId: regenerateMessage.messageId,
        message: parsedResponse.message,
        suggestions: parsedResponse.recipes,
      });

      // Save new recipes
      for (const recipe of parsedResponse.recipes) {
        await saveRecipeToDatabase(recipe);
      }
    } catch (error) {
      console.error('Error during regenerate response (OpenAI):', error);
      handleError(error, setIsLoading);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = async () => {
    if (!sessionId) return;

    setIsLoading(true);

    try {
      // Retrieve last user message
      const lastUserMessage = await getLastUserMessageObjectFromDB(sessionId);
      if (!lastUserMessage || !lastUserMessage.text) {
        throw new Error('No user message found to retry.');
      }

      const conversationHistory = formatConversationHistory(messages);
      const retryPrompt = `
        ${conversationHistory}
        Assistant:

        Please retry the user's last request:
        "${lastUserMessage.text}"

        Provide 3 unique recipe suggestions in valid JSON:
        {
          "message": "A brief conversational and friendly assistant message introducing the suggestions. Feel free to use a humorous style, add puns or witty remarks.",
          "recipes": [
            {
              "id": "unique_recipe_id",
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
          Also, Please answer with your best recipe ideas, using a fun and imaginative style. Feel free to incorporate unique ingredients or unexpected twists, unless the user's preferences forbid them. Let your creativity shine! Also, please ensure that the instructions include the amount of the ingredient in each of the steps.
      `;

      // Send to OpenAI
      const aiResponse = await sendMessageToOpenai(retryPrompt, 'retry response');
      const parsedResponse = parseAIResponse(aiResponse);

      if (!parsedResponse || !parsedResponse.recipes) {
        throw new Error('Invalid response structure from OpenAI GPT-4o Mini');
      }

      const retryMessage: ChatMessage = {
        id: Date.now(),
        messageId: Date.now().toString(),
        sessionId,
        timestamp: new Date(),
        sender: 'ai',
        text: parsedResponse.message,
      };

      addMessage(retryMessage);
      setLastAIResponse(retryMessage);

      addRecipeSuggestionSet({
        responseId: retryMessage.messageId,
        message: parsedResponse.message,
        suggestions: parsedResponse.recipes,
      });

      // Save new recipes
      for (const recipe of parsedResponse.recipes) {
        await saveRecipeToDatabase(recipe);
      }
    } catch (error) {
      console.error('Error during retry (OpenAI):', error);
      handleError(error, setIsLoading);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleSendMessage,
    handleRegenerateResponse,
    handleRetry,
  };
};
