'use client';

import React, { useState } from 'react';
import { useToast } from './ui/use-toast';
import { useSession } from 'next-auth/react';
import { saveRecipe } from '../services/recipeService';

interface Recipe {
  recipeId: string;
  title: string;
  ingredients: string[];
  instructions: string[];
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  cuisine?: string;
  dietaryRestrictions?: string[];
  imageUrl?: string;
}

interface SaveRecipeButtonProps {
  recipe: Recipe;
}

const SaveRecipeButton: React.FC<SaveRecipeButtonProps> = ({ recipe }) => {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { data: session } = useSession();

  const handleSaveRecipe = async () => {
    if (!session || !session.user) {
      toast("Please log in to save recipes.");
      return;
    }

    const userIdentifier = session.user.email;
    if (!userIdentifier) {
      toast("Unable to identify user. Please try logging in again.");
      return;
    }

    setIsSaving(true);
    try {
      await saveRecipe(userIdentifier, recipe);
      toast(`Recipe "${recipe.title}" saved successfully!`);
    } catch (error) {
      console.error('Error saving recipe:', error);
      toast("Failed to save the recipe. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <button 
      onClick={handleSaveRecipe} 
      disabled={isSaving}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
    >
      {isSaving ? 'Saving...' : 'Save Recipe'}
    </button>
  );
};

export default SaveRecipeButton;