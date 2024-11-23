// FavoritesPage.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getFavoriteRecipesFromDB } from '../utils/favoritesUtils';
import { useRouter } from 'next/navigation';
import { Recipe } from '../../types/Recipe'; // Make sure Recipe is imported

const FavoritesPage = () => {
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchFavoriteRecipes = async () => {
      const recipes =  getFavoriteRecipesFromDB();
      setFavoriteRecipes(recipes);
    };

    fetchFavoriteRecipes();
  }, []);

  const handleRecipeClick = (recipeId: string) => {
    router.push(`/recipe-view?recipeId=${recipeId}`);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white overflow-hidden">
      {/* Header */}
      <Header centralText="Favorite Recipes" />

      {/* Main Content */}
      <div className="flex-grow p-8 overflow-y-auto">
        {favoriteRecipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {favoriteRecipes.map((recipe) => (
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
          <div className="text-center text-gray-400">No favorite recipes yet. Start adding your favorites!</div>
        )}
      </div>

      {/* Footer */}
      <Footer actions={['home', 'save', 'send']} />
    </div>
  );
};

export default FavoritesPage;
