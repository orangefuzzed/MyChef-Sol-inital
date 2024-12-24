'use client';

import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getSavedRecipesFromDB, deleteRecipeFromDB, saveRecipeToDB } from '../utils/indexedDBUtils';
import { useRouter } from 'next/navigation';
import { Recipe } from '../../types/Recipe';
import { Flame, Clock, Soup, Bookmark, Trash2 } from 'lucide-react';
import Toast from '../components/Toast'; // Import the Toast component

const SavedRecipesPage = () => {
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const router = useRouter();

  useEffect(() => {
    const fetchAndMergeSavedRecipes = async () => {
      try {
        // Fetch saved recipes from IndexedDB
        const localRecipes = await getSavedRecipesFromDB();
  
        // Fetch saved recipes from MongoDB
        const remoteRecipes: Recipe[] = await (async () => {
          try {
            const response = await fetch('/api/recipes/saved');
            if (response.ok) {
              return await response.json();
            } else {
              console.error('Failed to fetch saved recipes from MongoDB:', response.statusText);
              return [];
            }
          } catch (error) {
            console.error('Error fetching saved recipes from MongoDB:', error);
            return [];
          }
        })();
  
        // Merge recipes into a single unique list
        const mergedRecipesMap = new Map<string, Recipe>();
        [...localRecipes, ...remoteRecipes].forEach((recipe) =>
          mergedRecipesMap.set(recipe.id, recipe) // Use `id` as the unique key
        );
  
        const mergedRecipes = Array.from(mergedRecipesMap.values());
  
        // Sync missing MongoDB recipes into IndexedDB
        for (const remoteRecipe of remoteRecipes) {
          if (!localRecipes.some((localRecipe) => localRecipe.id === remoteRecipe.id)) {
            await saveRecipeToDB(remoteRecipe); // Ensure this utility exists
          }
        }
  
        // Update state with the merged recipes
        setSavedRecipes(mergedRecipes);
      } catch (error) {
        console.error('Error fetching and merging saved recipes:', error);
      }
    };
  
    fetchAndMergeSavedRecipes();
  }, []);
  ;

  const handleRecipeClick = (id: string) => {
    router.push(`/recipe-view?id=${id}`);
  };

  const handleDeleteRecipe = async (id: string) => {
    try {
      // Remove from IndexedDB
      await deleteRecipeFromDB(id);

      // Remove from MongoDB
      const response = await fetch(`/api/recipes/saved?id=${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete recipe from MongoDB');
      }

      // Update UI
      setSavedRecipes((prevRecipes) => prevRecipes.filter((recipe) => recipe.id !== id));

      // Show success toast
      setToastMessage('Recipe successfully deleted!');
      setToastType('success');
      setToastVisible(true);

      // Auto-hide toast
      setTimeout(() => {
        setToastVisible(false);
      }, 3000);
    } catch (error) {
      console.error('Error deleting recipe:', error);

      // Show error toast
      setToastMessage('Failed to delete recipe.');
      setToastType('error');
      setToastVisible(true);

      // Auto-hide toast
      setTimeout(() => {
        setToastVisible(false);
      }, 3000);
    }
  };

  return (
    <div
      className="flex flex-col h-screen bg-fixed bg-cover bg-center text-white"
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
                key={recipe.id}
                className="bg-white/30 backdrop-blur-lg border-white border shadow-lg ring-1 ring-black/5 p-6 rounded-2xl relative"
                onClick={() => handleRecipeClick(recipe.id)} // Updated `recipeId` to `id`
              >
                {/* Left-Side Icon */}
                <div className="bg-sky-50/30 w-8 h-8 border border-white rounded-full flex items-center justify-center mb-2">
                  <Bookmark strokeWidth={1.5} className="w-4 h-4 text-black" />
                </div>

                {/* Delete Button */}
                <button
                  className="absolute top-4 right-4 bg-red-600 text-white p-2 rounded-full shadow-md hover:bg-red-500 transition"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent bubbling to the card's click handler
                    handleDeleteRecipe(recipe.id);
                  }}
                  aria-label="Delete Recipe"
                   >
                  <Trash2 size={16} />
                </button>

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
          <div className="text-center text-gray-400">
            No saved recipes yet. Start saving your favorites!
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer actions={['home', 'send']} />

      {/* Toast Component */}
      {toastVisible && (
        <Toast message={toastMessage} type={toastType} onClose={() => setToastVisible(false)} />
      )}
    </div>
  );
};

export default SavedRecipesPage;
