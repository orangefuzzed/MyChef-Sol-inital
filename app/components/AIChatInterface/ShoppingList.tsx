import React, { useEffect, useState } from 'react';
import { ShoppingListItem } from '../../../types/ShoppingListItem';
import Toast from '../Toast'; // Assuming the Toast component exists
import { ShoppingCart } from 'lucide-react';
import {
  saveShoppingListToDB,
  deleteShoppingListFromDB,
  getSavedShoppingListsFromDB,
} from '../../utils/shoppingListUtils';
import { useRecipeContext } from '../../contexts/RecipeContext';
import { useSearchParams } from 'next/navigation';

interface ShoppingListProps {
  shoppingListData: {
    ingredients: ShoppingListItem[];
    totalItems: number;
  };
  recipeTitle: string;
}

const ShoppingList: React.FC<ShoppingListProps> = ({
  shoppingListData,
  recipeTitle,
}) => {
  const searchParams = useSearchParams();
  const id = searchParams ? searchParams.get('id') : null; // Add null-check for `searchParams`
  const [isShoppingListSaved, setIsShoppingListSaved] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error' | null>(null);
  const { selectedRecipe, currentShoppingList } =
    useRecipeContext();

  const triggerToast = (message: string, type: 'success' | 'error') => {
    setToastMessage(message);
    setToastType(type);
  };

  useEffect(() => {
    if (!id) return;

    const fetchSavedState = async () => {
      try {
        const savedShoppingList = await getSavedShoppingListsFromDB(id);
        setIsShoppingListSaved(savedShoppingList !== null);
      } catch (error) {
        console.error('Failed to fetch saved state:', error);
      }
    };

    fetchSavedState();
  }, [id]);

  const handleShoppingListSaveToggle = async () => {
      if (!currentShoppingList || !id || !selectedRecipe) return; // Ensure required variables are not null
  
      try {
        if (isShoppingListSaved) {
          // Delete from IndexedDB
          await deleteShoppingListFromDB(id);
          setIsShoppingListSaved(false);
          triggerToast('Shopping list removed successfully!', 'success');
          // Delete from MongoDB
          const response = await fetch(`/api/shopping-lists?id=${id}`, {
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
          await saveShoppingListToDB(id, currentShoppingList, selectedRecipe.recipeTitle);
          setIsShoppingListSaved(true);
          triggerToast('Shopping list saved successfully!', 'success');
          // Save to MongoDB with recipeTitle
          const response = await fetch('/api/shopping-lists', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, shoppingList: currentShoppingList, recipeTitle: selectedRecipe.recipeTitle }),
          });
  
          if (!response.ok) {
            console.error('Failed to save shopping list to MongoDB:', await response.text());
          }
        }
      } catch (error) {
        console.error('Error while toggling shopping list save:', error);
        triggerToast('Failed to update shopping list. Please try again.', 'error');
      }
    };

  return (
    <div className="shopping-list bg-white/30 backdrop-blur-lg border-white border shadow-lg ring-1 ring-black/5 p-6 rounded-2xl">
      <h2 className="text-2xl font-medium text-sky-50 text-center">
        Shopping List for: {recipeTitle}
      </h2>
      <div className="py-3 flex items-center text-sm text-black before:flex-1 before:border-t before:border-pink-800 before:me-6 after:flex-1 after:border-t after:border-pink-800 after:ms-6 dark:text-white dark:before:border-neutral-600 dark:after:border-neutral-600">
        ITEMS
      </div>
      <ul className="list-disc pl-6 space-y-2 text-base">
        {shoppingListData.ingredients.map((item, index) => (
          <li key={index}>{item.name}</li>
        ))}
      </ul>
      <p className="mt-6 font-semibold">Total Items: {shoppingListData.totalItems}</p>

      {/* Save/Remove Button */}
      <div className="mt-4 flex justify-center">
        <button
          onClick={handleShoppingListSaveToggle}
          className={`p-2 px-6 rounded-full flex items-center gap-2 ${
            isShoppingListSaved ? 'bg-pink-800 text-white' : 'bg-sky-50 text-pink-800'
          } shadow-md transition-all duration-200`}
        >
          {isShoppingListSaved ? 'Remove from Saved Lists' : 'Save Shopping List'}
          <ShoppingCart size={20} />
        </button>
      </div>

      {/* Toast Messages */}
      {toastMessage && toastType && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => {
            setToastMessage(null);
            setToastType(null);
          }}
        />
      )}
    </div>
  );
};

ShoppingList.defaultProps = {
  shoppingListData: { ingredients: [], totalItems: 0 },
  recipeTitle: 'Unknown Recipe',
};

export default ShoppingList;
