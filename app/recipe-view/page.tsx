// RecipeViewPage.tsx - Updated to Address Hydration Issues and Best Practices
'use client';

import React, { useEffect, useState } from 'react';
import { useRecipeContext } from '../contexts/RecipeContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import RecipeDetails from '../components/AIChatInterface/RecipeDetails';
import { ArrowLeftCircle, Bookmark, Heart } from 'lucide-react';
import { saveRecipeToDB, deleteRecipeFromDB, getSavedRecipesFromDB } from '../utils/indexedDBUtils';
import { saveRecipeToFavorites, deleteRecipeFromFavorites, getFavoriteRecipesFromDB } from '../utils/favoritesUtils';
import { Suspense } from 'react';

const RecipeViewPage = () => {
  const { selectedRecipe } = useRecipeContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const recipeId = searchParams.get('recipeId');
  const [isSaved, setIsSaved] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [hydrationReady, setHydrationReady] = useState(false);

  useEffect(() => {
    // Set hydration state to true once component mounts to avoid hydration issues
    setHydrationReady(true);
  }, []);

  useEffect(() => {
    if (!recipeId) return;

    const checkIfSaved = async () => {
      const savedRecipes = await getSavedRecipesFromDB();
      const found = savedRecipes.find((recipe) => recipe.recipeId === recipeId);
      setIsSaved(!!found);
    };

    const checkIfFavorited = async () => {
      const favoriteRecipes = await getFavoriteRecipesFromDB();
      const found = favoriteRecipes.find((recipe) => recipe.recipeId === recipeId);
      setIsFavorited(!!found);
    };

    if (hydrationReady) {
      checkIfSaved();
      checkIfFavorited();
    }
  }, [recipeId, hydrationReady]);

  if (!hydrationReady) {
    return null; // Prevent rendering until hydration is ready
  }

  if (!recipeId) {
    return <div className="text-white p-4">No recipe selected. Please go back and select a recipe.</div>;
  }

  const handleBackToSuggestions = () => {
    router.push('/recipe-suggestions');
  };

  const handleSaveToggle = async () => {
    if (!selectedRecipe) return;

    try {
      if (isSaved) {
        await deleteRecipeFromDB(recipeId);
        setIsSaved(false);
        const response = await fetch(`/api/recipes/saved?recipeId=${recipeId}`, {
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
    if (!selectedRecipe) return;

    try {
      if (isFavorited) {
        await deleteRecipeFromFavorites(recipeId);
        setIsFavorited(false);
        const response = await fetch(`/api/recipes/favorites?recipeId=${recipeId}`, {
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
      <div className="h-screen flex flex-col bg-gray-900 text-white overflow-hidden">
        {/* Header */}
        <Header
          centralText="Recipe Details"
          backButton={{
            label: 'Back to Suggestions',
            icon: <ArrowLeftCircle size={24} />,
            onClick: handleBackToSuggestions,
          }}
        />

        {/* Main Content */}
        <div className="flex-grow p-8 overflow-y-auto">
          <RecipeDetails />
        </div>

        {/* Footer with Save and Favorite Toggles */}
        <Footer
          actions={['home', 'send']}
          contextualActions={[
            {
              label: isSaved ? 'Saved' : 'Save',
              icon: <Bookmark size={24} color={isSaved ? 'green' : 'white'} />,
              onClick: handleSaveToggle,
            },
            {
              label: isFavorited ? 'Favorited' : 'Favorite',
              icon: <Heart size={24} color={isFavorited ? 'red' : 'white'} />,
              onClick: handleFavoriteToggle,
            },
          ]}
        />
      </div>
    </Suspense>
  );
};

export default RecipeViewPage;
