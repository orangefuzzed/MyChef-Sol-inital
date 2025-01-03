import { useChat, ChatMessage } from '../contexts/ChatContext';
import { useRecipeContext } from '../contexts/RecipeContext';
import { sendMessageToClaude } from '../services/claudeService';
import { handleError, generatePrompt, formatConversationHistory, parseAIResponse } from '../utils/chatUtils';
import { saveRecipeToDatabase } from '../services/claudeService';
import { saveChatMessageToDB, getLastUserMessageObjectFromDB } from '../utils/indexedDBUtils';
import { Recipe } from '../../types/Recipe';


export const useAIChatHandlers = () => {
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
    preferences: any, // Pass preferences as an argument
    isPreferencesActive: boolean // Pass the toggle state as an argument
  ) => {
    if (!inputMessage || inputMessage.trim() === '') return;

    setIsLoading(true);

    try {
      const newSessionId = sessionId ?? Date.now().toString();

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

      const conversationHistory = formatConversationHistory(messages);

      // Generate prompt with or without preferences
      const fullPrompt = generatePrompt(
        conversationHistory,
        inputMessage,
        'sendMessage',
        preferences, // Include preferences
        isPreferencesActive // Include toggle state
      );

      // Send the generated prompt to Claude API
      const aiResponse = await sendMessageToClaude(fullPrompt, 'recipe suggestions');
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

      if (parsedResponse.recipes) {
        addRecipeSuggestionSet({
          responseId: aiMessage.messageId,
          message: parsedResponse.message,
          suggestions: parsedResponse.recipes,
        });
      }

      for (const recipe of parsedResponse.recipes) {
        await saveRecipeToDatabase(recipe);
      }
    } catch (error) {
      console.error('Error during sendMessage:', error);

      const errorMessage: ChatMessage = {
        id: Date.now(),
        messageId: Date.now().toString(),
        sessionId: sessionId ?? 'unknown',
        timestamp: new Date(),
        sender: 'system',
        text: 'Whoa, the kitchen’s a little chaotic right now! Let’s retry that request and get things back on track.',
      };

      setMessages((prevMessages: ChatMessage[]) => [...prevMessages, errorMessage]);
      setLastAIResponse(errorMessage);
      handleError(error, setIsLoading);
    }
  };
  

  const handleRegenerateResponse = async () => {
    if (!lastAIResponse || !sessionId) return;
  
    setIsLoading(true);
  
    try {
      // Generate conversation history and regenerate prompt
      const conversationHistory = formatConversationHistory(messages);
      const regeneratePrompt = `
        ${conversationHistory}
        Assistant:
  
        Please provide 3 additional recipe suggestions, ensuring they are unique, varied, and avoid duplicating previous suggestions.
  
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
  
      // Send the prompt to Claude and parse the response
      const aiResponse = await sendMessageToClaude(regeneratePrompt, 'get more suggestions');
      const parsedResponse = parseAIResponse(aiResponse);
  
      if (!parsedResponse || !parsedResponse.recipes) {
        throw new Error('Invalid response structure from Claude API');
      }
  
      // Create AI message and update context
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
  
      // Update the recipe suggestions
      addRecipeSuggestionSet({
        responseId: regenerateMessage.messageId,
        message: parsedResponse.message,
        suggestions: parsedResponse.recipes,
      });
  
      // Save recipes to the database
      for (const recipe of parsedResponse.recipes) {
        await saveRecipeToDatabase(recipe);
      }
    } catch (error) {
      console.error('Error during regenerate response:', error);
      handleError(error, setIsLoading);
    } finally {
      setIsLoading(false);
    }
  };  

  const handleRetry = async () => {
    if (!sessionId) return;
  
    setIsLoading(true);
  
    try {
      // Fetch the full last user message from IndexedDB
      const lastUserMessage = await getLastUserMessageObjectFromDB(sessionId);
      if (!lastUserMessage || !lastUserMessage.text) {
        throw new Error('No user message found to retry.');
      }
  
      // Generate conversation history and construct retry prompt
      const conversationHistory = formatConversationHistory(messages);
      const retryPrompt = `
        ${conversationHistory}
        Assistant:
  
        Please retry the user's last request:
        "${lastUserMessage.text}"
  
        Please provide 3 recipe suggestions based on the following user input.
          
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
  
      // Send the prompt to Claude and parse the response
      const aiResponse = await sendMessageToClaude(retryPrompt, 'retry response');
      const parsedResponse = parseAIResponse(aiResponse);
  
      if (!parsedResponse || !parsedResponse.recipes) {
        throw new Error('Invalid response structure from Claude API');
      }
  
      // Create a new AI message
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
  
      // Update the recipe suggestions if provided
      if (parsedResponse.recipes) {
        addRecipeSuggestionSet({
          responseId: retryMessage.messageId,
          message: parsedResponse.message,
          suggestions: parsedResponse.recipes,
        });
  
        // Save recipes to the database
        for (const recipe of parsedResponse.recipes) {
          await saveRecipeToDatabase(recipe);
        }
      }
    } catch (error) {
      console.error('Error during retry:', error);
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

