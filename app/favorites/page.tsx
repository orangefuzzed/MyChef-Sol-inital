'use client';

import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getFavoriteRecipesFromDB, deleteRecipeFromFavorites } from '../utils/favoritesUtils';
import { useRouter } from 'next/navigation';
import { Recipe } from '../../types/Recipe';
import { Flame, Clock, Soup, Heart, Trash2 } from 'lucide-react';
import Toast from '../components/Toast'; // Import the Toast component

const FavoritesPage = () => {
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const router = useRouter();
  const [toastVisible, setToastVisible] = useState(false); // Controls Toast visibility
  const [toastMessage, setToastMessage] = useState(''); // Toast message content
  const [toastType, setToastType] = useState<'success' | 'error'>('success'); // Toast type (success/error)

    useEffect(() => {
      const fetchFavoriteRecipes = async () => {
        let recipes = await getFavoriteRecipesFromDB();
  
        // If no recipes in IndexedDB, fetch from MongoDB
        if (recipes.length === 0) {
          try {
            const response = await fetch('/api/recipes/favorites');
            if (response.ok) {
              const favorites: Recipe[] = await response.json();
              recipes = favorites;
            } else {
              console.error('Failed to fetch saved recipes from MongoDB');
            }
          } catch (error) {
            console.error('Error fetching saved recipes from MongoDB:', error);
          }
        }
  
        setFavoriteRecipes(recipes);
      };
  
      fetchFavoriteRecipes();
    }, []);

  const handleRecipeClick = (id: string) => {
    router.push(`/recipe-view?id=${id}`);
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    // Utility to handle Toast messages
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);

    // Automatically hide Toast after 3 seconds
    setTimeout(() => setToastVisible(false), 3000);
  };

  const handleDeleteFavorite = async (id: string) => {
    if (!id) return; // Ensure `id` is not null before proceeding

    try {
      // Delete from IndexedDB
      await deleteRecipeFromFavorites(id);

      // Delete from MongoDB
      const response = await fetch(`/api/recipes/favorites?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('Failed to delete favorite from MongoDB:', await response.text());
        showToast('Failed to delete recipe from favorites. Please try again.', 'error');
        return;
      }

      // Update UI after successful deletion
      setFavoriteRecipes((prevRecipes) =>
        prevRecipes.filter((recipe) => recipe.id !== id)
      );
      showToast('Recipe successfully removed from favorites!', 'success');
    } catch (error) {
      console.error('Error while deleting favorite:', error);
      showToast('Failed to delete recipe from favorites. Please try again.', 'error');
    }
  };

  return (
    <div
      className="flex flex-col h-screen bg-fixed bg-cover bg-center text-white"
      style={{ backgroundImage: "url('/images/breakfast-1.png')" }}
    >
      {/* Header */}
      <Header centralText="Favorite Recipes" />

      {/* Main Content */}
      <div className="flex-grow p-8 overflow-y-auto">
        {favoriteRecipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {favoriteRecipes.map((recipe) => (
              <div
                key={recipe.id}
                className="bg-white/30 backdrop-blur-lg border-white border shadow-lg ring-1 ring-black/5 p-6 rounded-2xl relative"
                onClick={() => handleRecipeClick(recipe.id)} // Navigate to the recipe-view page
              >
                {/* Left-Side Icon */}
                <div className="bg-sky-50/30 w-8 h-8 border border-white rounded-full flex items-center justify-center mb-2">
                  <Heart strokeWidth={1.5} className="w-4 h-4 text-black" />
                </div>

                {/* Delete Button */}
                <button
                  className="absolute top-4 right-4 bg-red-600 text-white p-2 rounded-full shadow-md hover:bg-red-500 transition"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent bubbling to the card's onClick
                    handleDeleteFavorite(recipe.id); // Delete the recipe
                  }}
                  aria-label="Delete Favorite Recipe"
                >
                  <Trash2 size={16} />
                </button>

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

      {/* Footer */}
      <Footer actions={['home', 'send']} />

      {/* Toast Component */}
      {toastVisible && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setToastVisible(false)}
        />
      )}
    </div>
  );
};

export default FavoritesPage;
