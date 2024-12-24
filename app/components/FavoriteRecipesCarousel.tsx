'use client';

import React, { useEffect, useState } from 'react';
import { getFavoriteRecipesFromDB, saveRecipeToFavorites } from '../utils/favoritesUtils';
import { useRouter } from 'next/navigation';
import { Recipe } from '../../types/Recipe'; // Make sure Recipe is imported
import { Flame, Clock, Soup, Heart } from 'lucide-react';

const FavoriteRecipesCarousel: React.FC = () => {
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const router = useRouter();

  useEffect(() => {
      const fetchAndMergeFavorites = async () => {
        try {
          // Fetch local favorites from IndexedDB
          const localFavorites = await getFavoriteRecipesFromDB();
    
          // Fetch remote favorites from MongoDB
          const remoteFavorites: Recipe[] = await (async () => {
            try {
              const response = await fetch('/api/recipes/favorites');
              if (response.ok) {
                return await response.json();
              } else {
                console.error('Failed to fetch favorites from MongoDB:', response.statusText);
                return [];
              }
            } catch (error) {
              console.error('Error fetching favorites from MongoDB:', error);
              return [];
            }
          })();
    
          // Merge favorites into a single unique list
          const mergedFavoritesMap = new Map<string, Recipe>();
          [...localFavorites, ...remoteFavorites].forEach((favorite) =>
            mergedFavoritesMap.set(favorite.id, favorite) // Use `id` as the unique key
          );
    
          const mergedFavorites = Array.from(mergedFavoritesMap.values());
    
          // Sync missing MongoDB favorites to IndexedDB
          for (const remoteFavorite of remoteFavorites) {
            if (!localFavorites.some((localFavorite) => localFavorite.id === remoteFavorite.id)) {
              await saveRecipeToFavorites(remoteFavorite); // Ensure this utility exists
            }
          }
    
          // Update state with the merged favorites
          setFavoriteRecipes(mergedFavorites);
        } catch (error) {
          console.error('Error fetching and merging favorites:', error);
        }
      };
    
      fetchAndMergeFavorites();
    }, [])

  const handleRecipeClick = (id: string) => {
    router.push(`/recipe-view?id=${id}`);
  };

  return (
    <div className="p">
      <h2 className="text-2xl font-bold text-sky-50 mb-4 hidden">My Favorite Recipes</h2>
      {favoriteRecipes.length > 0 ? (
        <div className="flex gap-6 overflow-x-auto scrollbar-hide">
          {favoriteRecipes.map((recipe) => (
            <div
              key={recipe.id}
              className="w-64 bg-white/30 backdrop-blur-lg border-white border shadow-lg ring-1 ring-black/5 px-6 pt-6 pb-2 rounded-2xl flex-shrink-0"
              onClick={() => handleRecipeClick(recipe.id)}
            >
              {/* Left-Side Icon */}
              <div className="bg-sky-50/30 w-8 h-8 border border-white rounded-full flex items-center justify-center mb-2">
                <Heart strokeWidth={1.5} className="w-4 h-4 text-black" />
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
          No favorite recipes yet. Start adding your favorites!
        </div>
      )}
    </div>
  );
};

export default FavoriteRecipesCarousel;
