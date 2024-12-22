import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Recipe } from '../../types/Recipe';
import { ShoppingListItem } from '../../types/ShoppingListItem';
import { useSession } from 'next-auth/react';
import { saveRecipeToDB, getPendingRecipes, deletePendingRecipe } from '../utils/indexedDBUtils';

interface ShoppingList {
  ingredients: ShoppingListItem[];
  totalItems: number;
}

export interface RecipeSuggestionSet {  // Export this interface
  responseId: string;
  message: string;
  suggestions: Recipe[];
}

interface RecipeContextProps {
  selectedRecipe: Recipe | null;
  setSelectedRecipe: (recipe: Recipe | null) => void;
  recipeSuggestionSets: RecipeSuggestionSet[];
  addRecipeSuggestionSet: (suggestionSet: RecipeSuggestionSet) => void;
  setRecipeSuggestionSets: (sets: RecipeSuggestionSet[]) => void; // Add this setter to the context props
  savedRecipes: Recipe[];
  setSavedRecipes: (recipes: Recipe[]) => void;
  currentShoppingList: ShoppingList | null;
  setCurrentShoppingList: (shoppingList: ShoppingList | null) => void;
  currentCookMode: string | null;
  setCurrentCookMode: (cookMode: string | null) => void;
  saveRecipe: (recipe: Recipe) => Promise<void>;
  loadSavedRecipes: () => Promise<void>;
}

const RecipeContext = createContext<RecipeContextProps | undefined>(undefined);

export const RecipeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [recipeSuggestionSets, setRecipeSuggestionSets] = useState<RecipeSuggestionSet[]>([]);
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [currentShoppingList, setCurrentShoppingList] = useState<ShoppingList | null>(null);
  const [currentCookMode, setCurrentCookMode] = useState<string | null>(null);

  const loadSavedRecipes = async () => {
    if (!userEmail) return;

    try {
      const response = await fetch('/api/recipes/saved', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data && Array.isArray(data)) {
          setSavedRecipes(data);
        } else {
          console.error('Invalid response format: recipes not found');
        }
      } else {
        console.error('Failed to load saved recipes:', await response.text());
      }
    } catch (error) {
      console.error('Failed to load saved recipes:', error);
    }
  };

  const saveRecipe = async (recipe: Recipe) => {
    try {
      await saveRecipeToDB(recipe);

      const response = await fetch('/api/recipes/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recipe, userEmail }),
      });

      if (!response.ok) {
        throw new Error('Failed to save recipe to MongoDB');
      }

      setSavedRecipes((prevRecipes) => [...prevRecipes, recipe]);
    } catch (error) {
      console.error('Error saving recipe:', error);
    }
  };

  // Sync offline saved recipes when back online
  useEffect(() => {
    const syncPendingRecipes = async () => {
      const pendingRecipes = await getPendingRecipes();
      for (const recipe of pendingRecipes) {
        try {
          await saveRecipe(recipe);
          await deletePendingRecipe(recipe.id);
        } catch (error) {
          console.error('Error syncing recipe:', error);
        }
      }
    };

    window.addEventListener('online', syncPendingRecipes);
    return () => {
      window.removeEventListener('online', syncPendingRecipes);
    };
  }, []);

  // Function to add a new recipe suggestion set
  const addRecipeSuggestionSet = (suggestionSet: RecipeSuggestionSet) => {
    setRecipeSuggestionSets((prevSets) => [...prevSets, suggestionSet]);
  };

  return (
    <RecipeContext.Provider
      value={{
        selectedRecipe,
        setSelectedRecipe,
        recipeSuggestionSets,
        setRecipeSuggestionSets, // Provide the setter in the context
        addRecipeSuggestionSet,
        savedRecipes,
        setSavedRecipes,
        currentShoppingList,
        setCurrentShoppingList,
        currentCookMode,
        setCurrentCookMode,
        saveRecipe,
        loadSavedRecipes,
      }}
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
