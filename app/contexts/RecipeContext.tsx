import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Recipe } from '../../types/Recipe'; // Importing Recipe type from shared file

interface RecipeContextProps {
  selectedRecipe: Recipe | null;
  setSelectedRecipe: (recipe: Recipe | null) => void;
  recipeSuggestions: Recipe[];
  setRecipeSuggestions: (suggestions: Recipe[]) => void;
}

const RecipeContext = createContext<RecipeContextProps | undefined>(undefined);

export const RecipeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(() => {
    if (typeof window !== 'undefined') {
      const storedRecipe = localStorage.getItem('selectedRecipe');
      return storedRecipe ? JSON.parse(storedRecipe) : null;
    }
    return null;
  });

  const [recipeSuggestions, setRecipeSuggestions] = useState<Recipe[]>(() => {
    if (typeof window !== 'undefined') {
      const storedSuggestions = localStorage.getItem('recipeSuggestions');
      return storedSuggestions ? JSON.parse(storedSuggestions) : [];
    }
    return [];
  });

  useEffect(() => {
    if (selectedRecipe) {
      localStorage.setItem('selectedRecipe', JSON.stringify(selectedRecipe));
    } else {
      localStorage.removeItem('selectedRecipe');
    }
  }, [selectedRecipe]);

  useEffect(() => {
    if (recipeSuggestions.length > 0) {
      localStorage.setItem('recipeSuggestions', JSON.stringify(recipeSuggestions));
    } else {
      localStorage.removeItem('recipeSuggestions');
    }
  }, [recipeSuggestions]);

  return (
    <RecipeContext.Provider
      value={{ selectedRecipe, setSelectedRecipe, recipeSuggestions, setRecipeSuggestions }}
    >
      {children}
    </RecipeContext.Provider>
  );
};

export const useRecipeContext = () => {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error('useRecipeContext must be used within a RecipeProvider');
  }
  return context;
};
