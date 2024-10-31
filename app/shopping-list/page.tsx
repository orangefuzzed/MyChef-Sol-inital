'use client';

import React from 'react';
import { useRecipeContext } from './../contexts/RecipeContext';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ArrowLeftCircle } from 'lucide-react'; // Importing the arrow icon

const ShoppingListPage = () => {
  const { selectedRecipe } = useRecipeContext();
  const router = useRouter();

  if (!selectedRecipe) {
    return (
      <div className="h-screen flex flex-col bg-gray-900 text-white overflow-hidden">
        {/* Header */}
        <Header centralText="Shopping List" />

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

        {/* Footer */}
        <Footer actions={['home', 'save', 'favorite', 'send']} />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white overflow-hidden">
      {/* Header with Back Button */}
      <Header
        centralText="Shopping List"
        backButton={{
          label: 'Back to Recipe',
          icon: <ArrowLeftCircle size={24} />,
          onClick: () => router.push('/recipe-view'),
        }}
      />

      {/* Main Content */}
      <div className="flex-grow p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-4">Shopping List for {selectedRecipe.recipeTitle}</h1>
        <ul className="list-disc pl-5 space-y-2">
          {selectedRecipe.ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
        <p className="mt-4">Total Items: {selectedRecipe.ingredients.length}</p>
      </div>

      {/* Footer */}
      <Footer actions={['home', 'save', 'favorite', 'send']} />
    </div>
  );
};

export default ShoppingListPage;
