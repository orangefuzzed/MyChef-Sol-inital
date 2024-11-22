import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getChatMessagesFromDB, saveChatMessageToDB } from '../utils/indexedDBUtils';
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
  recipeSuggestions: Recipe[];  // Using the correct Recipe type here as well
  setRecipeSuggestions: (recipes: Recipe[]) => void;
  sessionId: string;  // <-- Add this line
  setSessionId: (id: string) => void; // <-- Add setSessionId if you need to modify it
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [lastAIResponse, setLastAIResponse] = useState<ChatMessage | null>(null);
  const [recipeSuggestions, setRecipeSuggestions] = useState<Recipe[]>([]);  // Updated to use the correct type
  const [sessionId, setSessionId] = useState<string>(() => Date.now().toString());  // <-- Add sessionId state

  useEffect(() => {
    const loadMessages = async () => {
      const savedMessages = await getChatMessagesFromDB();
      setMessages(savedMessages);
    };
    loadMessages();
  }, []);

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
