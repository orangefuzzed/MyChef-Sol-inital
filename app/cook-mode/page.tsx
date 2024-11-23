'use client';

import React, { useEffect, useState } from 'react';
import { useRecipeContext } from './../contexts/RecipeContext';
import CookMode from '../components/AIChatInterface/CookMode';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ArrowLeftCircle } from 'lucide-react'; // Import back icon
const CookModePage = () => {
  const { selectedRecipe, setSelectedRecipe } = useRecipeContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [hydrationReady, setHydrationReady] = useState(false);
  const recipeId = searchParams.get('recipeId');

  useEffect(() => {
    // Set hydration state to true once component mounts to avoid hydration issues
    setHydrationReady(true);
  }, []);

  useEffect(() => {
    // If there is a recipeId in the URL and no selectedRecipe, fetch the recipe
    if (recipeId && !selectedRecipe) {
      const fetchRecipe = async () => {
        try {
          const response = await fetch(`/api/recipes/saved?recipeId=${recipeId}`);
          if (response.ok) {
            const fetchedRecipe = await response.json();
            setSelectedRecipe(fetchedRecipe);
          } else {
            console.error('Failed to fetch recipe:', await response.text());
          }
        } catch (error) {
          console.error('Failed to fetch recipe:', error);
        }
      };

      fetchRecipe();
    }
  }, [recipeId, selectedRecipe, setSelectedRecipe]);

  if (!hydrationReady) {
    return null; // Prevent rendering until hydration is ready
  }

  if (!selectedRecipe) {
    return (
      <div className="h-screen flex flex-col bg-gray-900 text-white overflow-hidden">
        {/* Header with contextual Back Button */}
        <Header
          centralText="Cook Mode"
          backButton={{
            label: 'Back to Recipe',
            icon: <ArrowLeftCircle size={24} />,
            onClick: () => router.push('/recipe-view'),
          }}
        />

        {/* Main Content */}
        <div className="flex-grow p-8 overflow-y-auto">
          <p>No recipe selected. Please go back and select a recipe.</p>
          <button
            onClick={() => router.push('/recipe-view')}
            className="mt-4 p-2 bg-blue-500 rounded-full text-white"
          >
            Go Back to Recipe Selection
          </button>
        </div>

        {/* Footer with standard actions */}
        <Footer actions={['home', 'save', 'favorite', 'send']} />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white overflow-hidden">
      {/* Header with contextual Back Button */}
      <Header
        centralText={`Cook Mode: ${selectedRecipe.recipeTitle}`}
        backButton={{
          label: 'Back to Recipe',
          icon: <ArrowLeftCircle size={24} />,
          onClick: () => router.push(`/recipe-view?recipeId=${selectedRecipe.recipeId}`),
        }}
      />

      {/* Main Content */}
      {/* Main Content */}
        <div className="flex-grow p-8 overflow-y-auto">
          <CookMode cookModeData={selectedRecipe.instructions.join('\n')} />
        </div>


      {/* Footer with standard actions */}
      <Footer actions={['home', 'save', 'favorite', 'send']} />
    </div>
  );
};

export default CookModePage;
