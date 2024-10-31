'use client';

import React from 'react';
import { useRecipeContext } from './../contexts/RecipeContext';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ArrowLeftCircle } from 'lucide-react'; // Importing the arrow icon

const RecipeViewPage = () => {
  const { selectedRecipe, recipeSuggestions } = useRecipeContext();
  const router = useRouter();

  if (!selectedRecipe) {
    return <div className="text-white p-4">No recipe selected. Please go back and select a recipe.</div>;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white overflow-hidden">
      {/* Header */}
      <Header
        centralText="Recipe Details"
        backButton={
          recipeSuggestions.length > 0
            ? {
                label: 'Back to Suggestions',
                icon: <ArrowLeftCircle size={24} />,
                onClick: () => router.push('/recipe-suggestions'),
              }
            : undefined
        }
      />

      {/* Main Content */}
      <div className="flex-grow p-8 overflow-y-auto">
        <h2 className="text-4xl font-bold mb-4">{selectedRecipe.recipeTitle}</h2>
        <p className="text-lg mb-4">{selectedRecipe.description}</p>
        {selectedRecipe.rating !== undefined && (
          <p className="mb-4">Rating: {selectedRecipe.rating}</p>
        )}
        {selectedRecipe.protein !== undefined && (
          <p className="mb-4">Protein: {selectedRecipe.protein}g</p>
        )}

        <h3 className="text-2xl font-bold mb-2">Ingredients:</h3>
        {selectedRecipe.ingredients && selectedRecipe.ingredients.length > 0 ? (
          <ul className="list-disc pl-6 space-y-2">
            {selectedRecipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        ) : (
          <p>No ingredients available for this recipe.</p>
        )}

        <h3 className="text-2xl font-bold mt-6 mb-2">Instructions:</h3>
        {selectedRecipe.instructions && selectedRecipe.instructions.length > 0 ? (
          <ol className="list-decimal pl-6 space-y-2">
            {selectedRecipe.instructions.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ol>
        ) : (
          <p>No instructions available for this recipe.</p>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={() => router.push('/cook-mode')}
            className="p-2 bg-green-500 rounded-full text-white"
          >
            Cook Mode
          </button>
          <button
            onClick={() => router.push('/shopping-list')}
            className="p-2 bg-blue-500 rounded-full text-white"
          >
            Create Shopping List
          </button>
        </div>
      </div>

      {/* Footer */}
      <Footer actions={['home', 'save', 'favorite', 'send']} />
    </div>
  );
};

export default RecipeViewPage;
