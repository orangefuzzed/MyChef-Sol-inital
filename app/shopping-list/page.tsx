'use client';

import React, { useEffect, useState } from 'react';
import { useRecipeContext } from './../contexts/RecipeContext';
import ShoppingList from '../components/AIChatInterface/ShoppingList';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ArrowLeftCircle, ShoppingCart } from 'lucide-react';
import { saveShoppingListToDB, deleteShoppingListFromDB, getSavedShoppingListsFromDB } from '../utils/shoppingListUtils';

const ShoppingListPage = () => {
  const { selectedRecipe, setSelectedRecipe, currentShoppingList, setCurrentShoppingList } = useRecipeContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const recipeId = searchParams.get('recipeId');
  const [isShoppingListSaved, setIsShoppingListSaved] = useState(false);
  const [hydrationReady, setHydrationReady] = useState(false);

  useEffect(() => {
    // Set hydration state to true once component mounts to avoid hydration issues
    setHydrationReady(true);
  }, []);

  useEffect(() => {
    // If there's a recipeId in the URL, fetch the recipe and shopping list
    if (recipeId && !selectedRecipe) {
      const fetchRecipe = async () => {
        try {
          // Fetch the recipe details
          const response = await fetch(`/api/recipes/saved?recipeId=${recipeId}`);
          if (response.ok) {
            const fetchedRecipe = await response.json();
            setSelectedRecipe(fetchedRecipe);
          } else {
            console.error('Failed to fetch recipe:', await response.text());
          }
  
          // Fetch the shopping list for this recipeId
          const savedShoppingList = await getSavedShoppingListsFromDB(recipeId);
          if (savedShoppingList) {
            setCurrentShoppingList(savedShoppingList);
          }
        } catch (error) {
          console.error('Failed to fetch recipe or shopping list:', error);
        }
      };
  
      fetchRecipe();
    }
  }, [recipeId, selectedRecipe, setSelectedRecipe, setCurrentShoppingList]);
  

  useEffect(() => {
    if (!recipeId) return;

    const checkIfShoppingListSaved = async () => {
      if (!recipeId) return;

      try {
        const savedShoppingList = await getSavedShoppingListsFromDB(recipeId);
        setIsShoppingListSaved(savedShoppingList !== null);
      } catch (error) {
        console.error('Failed to check if shopping list is saved:', error);
      }
    };

    checkIfShoppingListSaved();
  }, [recipeId]);

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

  // Adjust the handleShoppingListSaveToggle function
const handleShoppingListSaveToggle = async () => {
  if (!currentShoppingList || !recipeId || !selectedRecipe) return;

  try {
    if (isShoppingListSaved) {
      // Delete from IndexedDB
      await deleteShoppingListFromDB(recipeId);
      setIsShoppingListSaved(false);

      // Delete from MongoDB
      const response = await fetch(`/api/shopping-lists?recipeId=${recipeId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        console.error('Failed to delete shopping list from MongoDB:', await response.text());
      }
    } else {
      // Save to IndexedDB with recipeTitle
      await saveShoppingListToDB(recipeId, currentShoppingList, selectedRecipe.recipeTitle);
      setIsShoppingListSaved(true);

      // Save to MongoDB with recipeTitle
      const response = await fetch('/api/shopping-lists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recipeId, shoppingList: currentShoppingList, recipeTitle: selectedRecipe.recipeTitle }),
      });

      if (!response.ok) {
        console.error('Failed to save shopping list to MongoDB:', await response.text());
      }
    }
  } catch (error) {
    console.error('Error while toggling shopping list save:', error);
  }
};


  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white overflow-hidden">
      {/* Header with Back Button */}
      <Header
        centralText="Shopping List"
        backButton={{
          label: 'Back to Recipe',
          icon: <ArrowLeftCircle size={24} />,
          onClick: () => router.push(`/recipe-view?recipeId=${selectedRecipe.recipeId}`),
        }}
      />

      {/* Main Content */}
      <div className="flex-grow p-8 overflow-y-auto">
        <ShoppingList shoppingListData={currentShoppingList} />
      </div>

      {/* Footer with Save Shopping List Toggle */}
      <Footer
        actions={['home', 'send']}
        contextualActions={[
          {
            label: isShoppingListSaved ? 'List Saved' : 'Save List',
            icon: <ShoppingCart size={24} color={isShoppingListSaved ? 'blue' : 'white'} />,
            onClick: handleShoppingListSaveToggle,
          },
        ]}
      />
    </div>
  );
};

export default ShoppingListPage;
