import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { saveChatMessageToDB, clearAllChatDataFromDB } from '../utils/indexedDBUtils';
import { generateNewSessionId } from '../utils/sessionUtils'; // Importing the session utility function
import { Recipe } from '../../types/Recipe';  // Importing Recipe from the correct source

export interface ChatMessage {
  id: number;
  messageId: string;
  sessionId: string;
  timestamp: Date;
  sender: 'user' | 'ai';
  text: string;
  suggestions?: Recipe[];  // Using the correct Recipe type here
}

interface ChatContextType {
  messages: ChatMessage[];
  addMessage: (message: ChatMessage) => void;
  setMessages: (messages: ChatMessage[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  inputMessage: string;
  setInputMessage: (message: string) => void;
  lastAIResponse: ChatMessage | null;
  setLastAIResponse: (response: ChatMessage | null) => void;
  recipeSuggestions: Recipe[];
  setRecipeSuggestions: (recipes: Recipe[]) => void;
  sessionId: string;
  setSessionId: (id: string) => void;
  startNewSession: () => Promise<void>; // Updated to be async
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [lastAIResponse, setLastAIResponse] = useState<ChatMessage | null>(null);
  const [recipeSuggestions, setRecipeSuggestions] = useState<Recipe[]>([]);  // Updated to use the correct type
  const [sessionId, setSessionId] = useState<string>(() => generateNewSessionId()); // <-- Use the utility function for sessionId

  // Updated startNewSession function to ensure complete reset
const startNewSession = async () => {
  console.log('Starting a brand new session...');

  // Step 1: Clear Persistent Storage (IndexedDB)
  await clearAllChatDataFromDB(); // Clear all chat messages, sessions, and recipe suggestions
  console.log('Persistent storage cleared.');

  // Step 2: Clear State Variables
  setSessionId(generateNewSessionId());
  setMessages([]);
  setLastAIResponse(null);
  setRecipeSuggestions([]);  // Clear the recipe suggestions explicitly from React state
  setInputMessage('');

  // Step 3: Trigger a Re-Render of Recipe Suggestions Component
  setRecipeSuggestions([...[]]);  // Explicitly "reset" recipe suggestions by setting to a fresh array

  // Step 4: Add a small delay to ensure state updates are properly reflected
  await new Promise((resolve) => setTimeout(resolve, 100));

  console.log('Session completely reset.');
};



  {/*useEffect(() => {
    const loadMessages = async () => {
      if (sessionId !== 'current_session_id') { // Only load if this is NOT a new session
        const savedMessages = await getChatMessagesFromDB();
        setMessages(savedMessages);
      } else {
        console.log("Skipping message load for a new session.");
      }
    };
    loadMessages();
  }, [sessionId]);*/}
  

  const addMessage = async (message: ChatMessage) => {
    setMessages((prevMessages) => [...prevMessages, message]);
    await saveChatMessageToDB(message);
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        addMessage,
        setMessages,
        isLoading,
        setIsLoading,
        inputMessage,
        setInputMessage,
        lastAIResponse,
        setLastAIResponse,
        recipeSuggestions,
        setRecipeSuggestions,
        sessionId, // <-- Provide sessionId in the context
        setSessionId, // <-- Provide setSessionId if modifications are needed
        startNewSession, // <-- Provide startNewSession function in the context
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
