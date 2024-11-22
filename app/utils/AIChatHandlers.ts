import { useChat, ChatMessage } from '../contexts/ChatContext';
import { useRecipeContext } from '../contexts/RecipeContext';
import { sendMessageToClaude } from '../services/claudeService';
import { handleError, generatePrompt, formatConversationHistory, parseAIResponse } from '../utils/chatUtils';
import { saveRecipeToDatabase } from '../services/claudeService';
import { saveChatMessageToDB } from '../utils/indexedDBUtils';
import { Recipe } from '../../types/Recipe';

export const useAIChatHandlers = () => {
  const {
    messages,
    addMessage,
    setMessages,
    
    setIsLoading,
    
    setLastAIResponse,
    sessionId, // Add sessionId from ChatContext
  } = useChat();

  const { addRecipeSuggestionSet } = useRecipeContext();

  // Handle Send Message
  const handleSendMessage = async (inputMessage: string) => {
    if (!inputMessage || inputMessage.trim() === '') return;

    setIsLoading(true);

    try {
      // Ensure the sessionId is properly set
      const newSessionId = sessionId ?? Date.now().toString();

      const newMessage: ChatMessage & { id: number } = {
        id: Date.now(),
        messageId: Date.now().toString(),
        sessionId,
        timestamp: new Date(),
        sender: 'user',
        text: inputMessage,
      };

      addMessage(newMessage);
      await saveChatMessageToDB(newMessage); // Save user message to IndexedDB

      // Generate the prompt using the utility functions
      const conversationHistory = formatConversationHistory(messages);
      const fullPrompt = generatePrompt(conversationHistory, inputMessage, 'sendMessage');

      // Send the message to Claude and get AI response
      const aiResponse = await sendMessageToClaude(fullPrompt, 'recipe suggestions');

      // Parse AI response
      const parsedResponse = parseAIResponse(aiResponse);

      // Update messages and store the recipe suggestions
      const aiMessage: ChatMessage & { suggestions?: Recipe[] } = {
        id: Date.now() + 1,
        messageId: (Date.now() + 1).toString(),
        sessionId,
        timestamp: new Date(),
        sender: 'ai',
        text: parsedResponse.message,
        suggestions: parsedResponse.recipes,
      };

      addMessage(aiMessage);
      setLastAIResponse(aiMessage);
      await saveChatMessageToDB(aiMessage); // Save AI response with suggestions to IndexedDB

      // Add the recipe suggestion set to RecipeContext
      if (parsedResponse.recipes) {
        addRecipeSuggestionSet({
          responseId: aiMessage.messageId,
          message: parsedResponse.message,
          suggestions: parsedResponse.recipes,
        });
      }

      // Save recipes to the database
      for (const recipe of parsedResponse.recipes) {
        await saveRecipeToDatabase(recipe);
      }
    } catch (error) {
      handleError(error, Date.now() + 1, setMessages, setIsLoading);
    } finally {
      setIsLoading(false);
    }
  };

  // Placeholder functions for other handlers
  const handleRegenerateResponse = async () => {
    console.warn('handleRegenerateResponse is not yet implemented.');
  };

  const handleContinueResponse = async () => {
    console.warn('handleContinueResponse is not yet implemented.');
  };

  const handleRetryOverload = async () => {
    console.warn('handleRetryOverload is not yet implemented.');
  };

  return {
    handleSendMessage,
    handleRegenerateResponse,
    handleContinueResponse,
    handleRetryOverload,
  };
};
