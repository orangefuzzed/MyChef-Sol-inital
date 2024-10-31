'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Recipe } from '../../types/Recipe'; // Adjust the import path as necessary
import { Message } from '../../types/Message'; // Adjust the import path as necessary

interface UserContextProps {
  userEmail: string | null;
  setUserEmail: (email: string | null) => void;
  selectedRecipe: Recipe | null;
  setSelectedRecipe: (recipe: Recipe | null) => void;
  messages: Message[];
  setMessages: (messages: Message[]) => void;
}

const UserContext = createContext<UserContextProps>({
  userEmail: null,
  setUserEmail: () => {},
  selectedRecipe: null,
  setSelectedRecipe: () => {},
  messages: [],
  setMessages: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  return (
    <UserContext.Provider
      value={{
        userEmail,
        setUserEmail,
        selectedRecipe,
        setSelectedRecipe,
        messages,
        setMessages,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
