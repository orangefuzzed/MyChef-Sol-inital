import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getChatMessagesFromDB, saveChatMessageToDB } from '../utils/indexedDBUtils';
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
  startNewSession: () => void; // <-- Adding startNewSession function
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [lastAIResponse, setLastAIResponse] = useState<ChatMessage | null>(null);
  const [recipeSuggestions, setRecipeSuggestions] = useState<Recipe[]>([]);  // Updated to use the correct type
  const [sessionId, setSessionId] = useState<string>(() => generateNewSessionId()); // <-- Use the utility function for sessionId

  // Function to start a new session
  const startNewSession = () => {
    const newId = generateNewSessionId(); // Generate a new session ID
    setSessionId(newId);
    setMessages([]); // Clear chat messages for the new session
    setLastAIResponse(null); // Reset the AI response state
    setRecipeSuggestions([]); // Clear any existing recipe suggestions
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
