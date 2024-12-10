// cook-mode/page.tsx - Updated to Handle SearchParams and Hydration Issues
'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useRecipeContext } from './../contexts/RecipeContext';
import CookMode from '../components/AIChatInterface/CookMode';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';


// Wrapping the entire page in Suspense
const CookModePageWrapper = () => {
  return (
    <Suspense fallback={<div>Loading Cook Mode...</div>}>
      <CookModePage />
    </Suspense>
  );
};

const CookModePage = () => {
  const { selectedRecipe, setSelectedRecipe } = useRecipeContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [hydrationReady, setHydrationReady] = useState(false);
  const id = searchParams ? searchParams.get('id') : null; // Null-check for searchParams

  useEffect(() => {
    // Set hydration state to true once component mounts to avoid hydration issues
    setHydrationReady(true);
  }, []);

  useEffect(() => {
    // If there is an id in the URL and no selectedRecipe, fetch the recipe
    if (id && !selectedRecipe) {
      const fetchRecipe = async () => {
        try {
          const response = await fetch(`/api/recipes/saved?id=${id}`);
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
  }, [id, selectedRecipe, setSelectedRecipe]);

  if (!hydrationReady) {
    return null; // Prevent rendering until hydration is ready
  }

  if (!selectedRecipe) {
    return (
      <div className="flex flex-col h-screen bg-fixed bg-cover bg-center text-white"
        style={{ backgroundImage: "url('/images/pizza-1.png')" }}
        >
        {/* Header with contextual Back Button */}
        <Header
          centralText="Cook Mode"
          
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
    <div className="flex flex-col h-screen bg-fixed bg-cover bg-center text-white"
        style={{ backgroundImage: "url('/images/pizza-1.png')" }}
        >
      {/* Header with contextual Back Button */}
      <Header
        centralText={`Cook Mode: ${selectedRecipe.recipeTitle}`}
        
      />

      {/* Main Content */}
      <div className="flex-grow p-8 overflow-y-auto">
      <CookMode cookModeData={selectedRecipe.instructions} /> {/* Pass array directly */}
      </div>

      {/* Footer with standard actions */}
      <Footer actions={['home', 'save', 'favorite', 'send']} />
    </div>
  );
};

export default CookModePageWrapper;
