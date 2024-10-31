import React, { createContext, useContext, useState } from 'react';

// Define the context shape
interface AIContextType {
  aiResponse: string | null;
  setAIResponse: (response: string) => void;
  userPreferences: UserPreferences;
  setUserPreferences: (preferences: UserPreferences) => void;
}

// Define the structure of user preferences
interface UserPreferences {
  dietaryRestrictions: string;
  favoriteCuisine: string;
  timeLimit?: number;
}

// Create context with default values
const AIContext = createContext<AIContextType | undefined>(undefined);

export const AIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State to store AI responses
  const [aiResponse, setAIResponse] = useState<string | null>(null);

  // State to store user preferences (default can be fetched or set here)
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    dietaryRestrictions: '',
    favoriteCuisine: '',
    timeLimit: undefined,
  });

  return (
    <AIContext.Provider value={{ aiResponse, setAIResponse, userPreferences, setUserPreferences }}>
      {children}
    </AIContext.Provider>
  );
};

// Custom hook to use the AIContext
export const useAIContext = () => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAIContext must be used within an AIProvider');
  }
  return context;
};
