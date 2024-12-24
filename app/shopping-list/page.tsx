// shopping-list/page.tsx - Updated to Handle SearchParams and Hydration Issues
'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRecipeContext } from './../contexts/RecipeContext';
import ShoppingList from '../components/AIChatInterface/ShoppingList';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getSavedShoppingListsFromDB } from '../utils/shoppingListUtils';

const ShoppingListPage = () => {
  const { selectedRecipe, setSelectedRecipe, currentShoppingList, setCurrentShoppingList } = useRecipeContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams ? searchParams.get('id') : null; // Add null-check for `searchParams`
  const [hydrationReady, setHydrationReady] = useState(false);

  useEffect(() => {
    // Set hydration state to true once component mounts to avoid hydration issues
    setHydrationReady(true);
  }, []);

  useEffect(() => {
    if (!id || !hydrationReady) return;
  
    const fetchRecipe = async () => {
      try {
        const response = await fetch(`/api/recipes/saved?id=${id}`);
        if (response.ok) {
          const fetchedRecipe = await response.json();
          setSelectedRecipe(fetchedRecipe);
        } else {
          console.error('Failed to fetch recipe:', await response.text());
        }
  
        const savedShoppingList = await getSavedShoppingListsFromDB(id);
        if (savedShoppingList) {
          setCurrentShoppingList(savedShoppingList);
        }
      } catch (error) {
        console.error('Failed to fetch recipe or shopping list:', error);
      }
    };
  
    fetchRecipe();
  }, [hydrationReady, id, setSelectedRecipe, setCurrentShoppingList]);
  
  if (!hydrationReady) {
    return null; // Prevent rendering until hydration is ready
  }

  if (!selectedRecipe || !currentShoppingList) {
    return (
      <div className="h-screen flex flex-col bg-gray-900 text-white overflow-hidden">
        {/* Header with contextual Back Button */}
        <Header centralText="Shopping List" />

        {/* Main Content */}
        <div className="flex-grow p-8 overflow-y-auto">
          <p>No recipe selected. Please go back and select a recipe.</p>
          <button
            onClick={() => router.push('/ai-chat')}
            className="mt-4 p-2 bg-blue-500 rounded-full text-white"
          >
            Go Back to Recipe Selection
          </button>
        </div>

        {/* Footer with standard actions */}
        <Footer actions={['home', 'send']} />
      </div>
    );
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex flex-col h-screen bg-fixed bg-cover bg-center text-white"
        style={{ backgroundImage: "url('/images/fresh-store-6.png')" }}
        >
        {/* Header with Back Button */}
        <Header
          centralText="Shopping List"
        />

        {/* Main Content */}
        <div className="flex-grow p-8 overflow-y-auto">
          <ShoppingList shoppingListData={currentShoppingList} 
          recipeTitle={selectedRecipe?.recipeTitle || 'Recipe Title Missing'}/>
        </div>

        {/* Footer with Save Shopping List Toggle */}
        <Footer
          actions={['home', 'send']}
        />
      </div>
    </Suspense>
  );
};

export default ShoppingListPage;
