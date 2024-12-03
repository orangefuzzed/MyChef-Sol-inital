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
    sessionId, 
  } = useChat();

  const { addRecipeSuggestionSet } = useRecipeContext();

  // Handle Send Message
  const handleSendMessage = async (inputMessage: string) => {
    if (!inputMessage || inputMessage.trim() === '') return;

    setIsLoading(true);

    try {
      const newSessionId = sessionId ?? Date.now().toString();
      
      // Create user message object
      const newMessage: ChatMessage = {
        id: Date.now(),
        messageId: Date.now().toString(),
        sessionId: newSessionId,
        timestamp: new Date(),
        sender: 'user',
        text: inputMessage,
      };

      // Add message to the context state without duplication
      addMessage(newMessage);
      await saveChatMessageToDB(newMessage); // Save message to IndexedDB

      // Generate and send prompt
      const conversationHistory = formatConversationHistory(messages);
      const fullPrompt = generatePrompt(conversationHistory, inputMessage, 'sendMessage');

      // Send to Claude and handle response
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
      await saveChatMessageToDB(aiMessage); // Save AI response to IndexedDB

      // Add recipe suggestions if present
      if (parsedResponse.recipes) {
        addRecipeSuggestionSet({
          responseId: aiMessage.messageId,
          message: parsedResponse.message,
          suggestions: parsedResponse.recipes,
        });
      }

      // Save each recipe to database
      for (const recipe of parsedResponse.recipes) {
        await saveRecipeToDatabase(recipe);
      }
    } catch (error) {
      setMessages([
        ...messages,
        {
          id: Date.now() + 1,
          messageId: Date.now().toString(),
          sessionId: sessionId ?? 'unknown',
          timestamp: new Date(),
          sender: 'ai',
          text: 'An error occurred while processing your request. Please try again.',
        },
      ]);
  
      handleError(error, setIsLoading);
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
