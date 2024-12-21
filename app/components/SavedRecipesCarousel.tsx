'use client';

import React, { useEffect, useState } from 'react';
import { getSavedRecipesFromDB } from '../utils/indexedDBUtils';
import { useRouter } from 'next/navigation';
import { Recipe } from '../../types/Recipe';
import { Flame, Clock, Soup, Bookmark } from 'lucide-react';

const SavedRecipesCarousel: React.FC = () => {
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchSavedRecipes = async () => {
      let recipes = await getSavedRecipesFromDB();

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
          console.error('Error fetching saved recipes:', error);
        }
      }

      setSavedRecipes(recipes);
    };

    fetchSavedRecipes();
  }, []);

  const handleRecipeClick = (id: string) => {
    router.push(`/recipe-view?id=${id}`);
  };

  return (
    <div className="p">
      <h2 className="text-2xl font-bold text-sky-50 mb-4 hidden">Saved Recipes</h2>
      {savedRecipes.length > 0 ? (
        <div className="flex gap-6 overflow-x-auto scrollbar-hide">
          {savedRecipes.map((recipe) => (
            <div
              key={recipe.id}
              className="w-64 bg-white/30 backdrop-blur-lg border-white border shadow-lg ring-1 ring-black/5 p-6 rounded-2xl flex-shrink-0"
              onClick={() => handleRecipeClick(recipe.id)}
            >
              {/* Left-Side Icon */}
              <div className="bg-sky-50/30 w-8 h-8 border border-white rounded-full flex items-center justify-center mb-2">
                <Bookmark strokeWidth={1.5} className="w-4 h-4 text-black" />
              </div>
              <h3 className="text-lg font-semibold">{recipe.recipeTitle}</h3>
              <div className="rating text-sm text-amber-400 mb-2">
                Rating: {recipe.rating}
              </div>
              {/* Icons for kcal, time, protein */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex flex-col items-center text-xs text-slate-700">
                  <Flame className="w-5 h-5 text-pink-800 mb-1" />
                  <span>{recipe.calories}</span>
                </div>
                <div className="flex flex-col items-center text-xs text-slate-700">
                  <Clock className="w-5 h-5 text-pink-800 mb-1" />
                  <span>{recipe.cookTime}</span>
                </div>
                <div className="flex flex-col items-center text-xs text-slate-700">
                  <Soup className="w-5 h-5 text-pink-800 mb-1" />
                  <span>{recipe.protein} protein</span>
                </div>
              </div>
              <p className="text-sm text-slate-950">{recipe.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400">
          No saved recipes yet. Start saving your favorites!
        </div>
      )}
    </div>
  );
};

export default SavedRecipesCarousel;
