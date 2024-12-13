// RecipeViewPage.tsx - Updated to Address Hydration Issues and Best Practices
'use client';

import React, { useEffect, useState } from 'react';
import { useRecipeContext } from '../contexts/RecipeContext';
import { useSearchParams } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import RecipeDetails from '../components/AIChatInterface/RecipeDetails';
import { Bookmark, Heart } from 'lucide-react';
import { saveRecipeToDB, deleteRecipeFromDB, getSavedRecipesFromDB } from '../utils/indexedDBUtils';
import { saveRecipeToFavorites, deleteRecipeFromFavorites, getFavoriteRecipesFromDB } from '../utils/favoritesUtils';
import { Suspense } from 'react';

const RecipeViewPage = () => {
  const { selectedRecipe } = useRecipeContext();
  
  const searchParams = useSearchParams();
  const id = searchParams ? searchParams.get('id') : null; // Add null check for searchParams
  const [isSaved, setIsSaved] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [hydrationReady, setHydrationReady] = useState(false);

  useEffect(() => {
    // Set hydration state to true once component mounts to avoid hydration issues
    setHydrationReady(true);
  }, []);

  useEffect(() => {
    if (!id) return; // Add null check for `id`

    const checkIfSaved = async () => {
      const savedRecipes = await getSavedRecipesFromDB();
      const found = savedRecipes.find((recipe) => recipe.id === id);
      setIsSaved(!!found);
    };

    const checkIfFavorited = async () => {
      const favoriteRecipes = await getFavoriteRecipesFromDB();
      const found = favoriteRecipes.find((recipe) => recipe.id === id);
      setIsFavorited(!!found);
    };

    checkIfSaved();
    checkIfFavorited();
  }, [id]);

  if (!hydrationReady) {
    return null; // Prevent rendering until hydration is ready
  }

  if (!id) {
    return <div className="text-white p-4">No recipe selected. Please go back and select a recipe.</div>;
  }

  const handleSaveToggle = async () => {
    if (!selectedRecipe || !id) return; // Ensure `id` is not null before proceeding

    try {
      if (isSaved) {
        await deleteRecipeFromDB(id);
        setIsSaved(false);
        const response = await fetch(`/api/recipes/saved?id=${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          console.error('Failed to delete recipe from MongoDB:', await response.text());
        }
      } else {
        await saveRecipeToDB(selectedRecipe);
        setIsSaved(true);
        const response = await fetch('/api/recipes/saved', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(selectedRecipe),
        });
        if (!response.ok) {
          console.error('Failed to save recipe to MongoDB:', await response.text());
        }
      }
    } catch (error) {
      console.error('Error while toggling save:', error);
    }
  };

  const handleFavoriteToggle = async () => {
    if (!selectedRecipe || !id) return; // Ensure `id` is not null before proceeding

    try {
      if (isFavorited) {
        await deleteRecipeFromFavorites(id);
        setIsFavorited(false);
        const response = await fetch(`/api/recipes/favorites?id=${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          console.error('Failed to delete favorite from MongoDB:', await response.text());
        }
      } else {
        await saveRecipeToFavorites(selectedRecipe);
        setIsFavorited(true);
        const response = await fetch('/api/recipes/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(selectedRecipe),
        });
        if (!response.ok) {
          console.error('Failed to save favorite to MongoDB:', await response.text());
        }
      }
    } catch (error) {
      console.error('Error while toggling favorite:', error);
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div
        className="flex flex-col h-screen bg-fixed bg-cover bg-center text-white"
        style={{ backgroundImage: "url('/images/pizza-1.png')" }}
      >
        {/* Header */}
        <Header
          centralText="Recipe Details"
         />

        {/* Main Content */}
        <div className="flex-grow p-8 overflow-y-auto">
          <RecipeDetails />
        </div>

        {/* Footer with Save and Favorite Toggles */}
        <Footer
          actions={['home']}
          contextualActions={[
            {
              label: isSaved ? 'Recipe Saved' : 'Save Recipe',
              icon: <Bookmark strokeWidth={1.5} size={18} color={isSaved ? '#9d174d' : 'white'} />,
              onClick: handleSaveToggle,
            },
            {
              label: isFavorited ? 'Recipe Favorited' : 'Favorite Recipe',
              icon: <Heart strokeWidth={1.5} size={18} color={isFavorited ? '#9d174d' : 'white'} />,
              onClick: handleFavoriteToggle,
            },
          ]}
        />
      </div>
    </Suspense>
  );
};

export default RecipeViewPage;
