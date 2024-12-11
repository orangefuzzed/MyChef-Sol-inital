// app/saved-recipes/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getSavedRecipesFromDB } from '../utils/indexedDBUtils';
import { useRouter } from 'next/navigation';
import { Recipe } from '../../types/Recipe';
import { Flame, Clock, Soup, Heart } from 'lucide-react';

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

  const handleRecipeClick = (id: string) => { // Updated `recipeId` to `id`
    router.push(`/recipe-view?id=${id}`); // Updated query param from `recipeId` to `id`
  };

  return (
    <div className="flex flex-col h-screen bg-fixed bg-cover bg-center text-white"
        style={{ backgroundImage: "url('/images/steak-dinner-2.png')" }}
        >
      {/* Header */}
      <Header centralText="Saved Recipes" />

      {/* Main Content */}
      <div className="flex-grow p-8 overflow-y-auto">
        {savedRecipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {savedRecipes.map((recipe) => (
              <div
                key={recipe.id} // Updated `recipeId` to `id`
                className="bg-white/30 backdrop-blur-lg border-white border shadow-lg ring-1 ring-black/5 p-6 rounded-2xl"
                onClick={() => handleRecipeClick(recipe.id)} // Updated `recipeId` to `id`
              >
                {/* Left-Side Icon */}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -ml-4 bg-pink-800 w-8 h-8 border border-white rounded-full flex items-center justify-center">
                  <Heart strokeWidth={1.5} className="w-4 h-4 text-white" /> {/* Example icon, you can change this */}
                </div>
                <h3 className="text-lg font-semibold">{recipe.recipeTitle}</h3>
                <div className="rating text-sm text-amber-400 mb-2">Rating: {recipe.rating}</div>
                {/* Icons for kcal, time, protein */}
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex flex-col items-center text-xs text-slate-700">
                      <Flame className="w-5 h-5 text-pink-800 mb-1" />
                      <span> {recipe.calories}</span>
                    </div>
                    <div className="flex flex-col items-center text-xs text-slate-700">
                      <Clock className="w-5 h-5 text-pink-800 mb-1" />
                      <span> {recipe.cookTime} </span>
                    </div>
                    <div className="flex flex-col items-center text-xs text-slate-700">
                      <Soup className="w-5 h-5 text-pink-800 mb-1" />
                      <span> {recipe.protein} protein</span>
                    </div>
                  </div>
                <p className="text-sm text-slate-950">{recipe.description}</p>
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
