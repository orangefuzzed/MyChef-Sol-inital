// app/saved-recipes/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getSavedRecipesFromDB } from '../utils/indexedDBUtils';
import { useRouter } from 'next/navigation';
import { Recipe } from '../../types/Recipe';

const SavedRecipesPage = () => {
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchSavedRecipes = async () => {
      let recipes = await getSavedRecipesFromDB();
      
      // If no recipes in IndexedDB, fetch from MongoDB
      if (recipes.length === 0) {
        try {
          const response = await fetch('/api/recipes/saved');
          if (response.ok) {
            const fetchedRecipes: Recipe[] = await response.json();
            recipes = fetchedRecipes;
          } else {
            console.error('Failed to fetch saved recipes from MongoDB');
          }
        } catch (error) {
          console.error('Error fetching saved recipes from MongoDB:', error);
        }
      }

      setSavedRecipes(recipes);
    };

    fetchSavedRecipes();
  }, []);

  const handleRecipeClick = (recipeId: string) => {
    router.push(`/recipe-view?recipeId=${recipeId}`);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white overflow-hidden">
      {/* Header */}
      <Header centralText="Saved Recipes" />

      {/* Main Content */}
      <div className="flex-grow p-8 overflow-y-auto">
        {savedRecipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {savedRecipes.map((recipe) => (
              <div
                key={recipe.recipeId}
                className="bg-gray-800 p-4 rounded-lg cursor-pointer hover:bg-gray-700"
                onClick={() => handleRecipeClick(recipe.recipeId)}
              >
                <h3 className="text-lg font-semibold mb-2">{recipe.recipeTitle}</h3>
                <p className="text-sm text-gray-400">{recipe.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400">No saved recipes yet. Start saving your favorites!</div>
        )}
      </div>

      {/* Footer */}
      <Footer actions={['home', 'favorite', 'send']} />
    </div>
  );
};

export default SavedRecipesPage;
