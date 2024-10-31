'use client';

import React, { useEffect, useState } from 'react';
import { useRecipeContext } from '../contexts/RecipeContext';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ExternalLinkIcon } from '@radix-ui/react-icons';
import { Recipe } from '../../types/Recipe';

const RecipeSuggestionsPage = () => {
  const { recipeSuggestions, setRecipeSuggestions, setSelectedRecipe } = useRecipeContext();
  const router = useRouter();
  const [hasLoadedSuggestions, setHasLoadedSuggestions] = useState(false);

  // Load recipe suggestions from MongoDB on page load
  useEffect(() => {
    const fetchRecipeSuggestions = async () => {
      try {
        console.log('Attempting to fetch recipe suggestions from MongoDB...');
        const response = await fetch('/api/recipe-suggestions');
        if (!response.ok) {
          throw new Error('Failed to fetch recipe suggestions from MongoDB');
        }
        const data = await response.json();
        console.log('Fetched recipe suggestions from MongoDB:', data.recipes);

        // Set recipe suggestions in context only
        setRecipeSuggestions(data.recipes);
      } catch (error) {
        console.error('Error fetching recipe suggestions:', error);
      }
    };

    if (recipeSuggestions.length === 0) {
      // Fetch from MongoDB
      fetchRecipeSuggestions();
    }
    setHasLoadedSuggestions(true);
  }, [recipeSuggestions, setRecipeSuggestions]);

  // Don't render anything until the recipe suggestions have been loaded
  if (!hasLoadedSuggestions) {
    return null;
  }

  const handleSelectRecipe = (recipe: Recipe) => {
    // Ensure the ID is always a string
    const recipeWithId = {
      ...recipe,
      id: recipe.id || (('_id' in recipe && recipe._id) ? (recipe as { _id: string })._id.toString() : ''),
    };
  
    // Set the selected recipe and navigate to the recipe view page
    setSelectedRecipe(recipeWithId);
    router.push('/recipe-view');
  };
  

  if (recipeSuggestions.length === 0) {
    return (
      <div className="h-screen flex flex-col bg-gray-900 text-white overflow-hidden">
        <Header centralText="Recipe Suggestions" />
        <div className="flex-grow p-8 flex items-center justify-center">
          <p>No suggestions available. Please go back and request new suggestions.</p>
          <button
            onClick={() => router.push('/ai-chat')}
            className="mt-4 p-2 bg-blue-500 rounded-full text-white"
          >
            Go Back to Chat
          </button>
        </div>
        <Footer actions={['home', 'save', 'favorite', 'send']} />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white overflow-hidden">
      {/* Header */}
      <Header centralText="Recipe Suggestions" />

      {/* Main Content */}
      <div className="flex-grow p-8 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipeSuggestions.map((recipe) => (
          <div
            key={recipe.id}
            className="p-6 bg-gray-800 rounded-lg flex flex-col justify-between"
            onClick={() => handleSelectRecipe(recipe)}
          >
            <div>
              {recipe.imageURL && (
                <img
                  src={recipe.imageURL}
                  alt={recipe.recipeTitle}
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
              )}
              <h3 className="text-2xl font-bold mb-2">{recipe.recipeTitle}</h3>
              <p className="text-sm mb-4">{recipe.description}</p>
            </div>
            <div className="mt-4">
              <button className="p-2 bg-slate-700 rounded-full text-white flex items-center gap-2">
                View Recipe
                <ExternalLinkIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <Footer actions={['home', 'save', 'favorite', 'send']} />
    </div>
  );
};

export default RecipeSuggestionsPage;
