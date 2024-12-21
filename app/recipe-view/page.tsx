// RecipeViewPage.tsx - Updated to Address Hydration Issues and Best Practices
'use client';

import React, { useEffect, useState } from 'react';
import { useRecipeContext } from '../contexts/RecipeContext';
import { useSearchParams } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import RecipeDetails from '../components/AIChatInterface/RecipeDetails';
import {  getSavedRecipesFromDB } from '../utils/indexedDBUtils';
import {  getFavoriteRecipesFromDB } from '../utils/favoritesUtils';
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
          actions={['home', 'send']}
        />
      </div>
    </Suspense>
  );
};

export default RecipeViewPage;
