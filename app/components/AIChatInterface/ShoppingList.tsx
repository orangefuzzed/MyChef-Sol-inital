import React, { useEffect, useState } from 'react';
import { ShoppingListItem } from '../../../types/ShoppingListItem';
import { ShoppingCart } from 'lucide-react';
import {
  saveShoppingListToDB,
  deleteShoppingListFromDB,
  getSavedShoppingListsFromDB,
} from '../../utils/shoppingListUtils';
import { useRecipeContext } from '../../contexts/RecipeContext';
import { useSearchParams } from 'next/navigation';
import { useToast } from '../../contexts/ToastContext'; // Import the Toast context

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
  const id = searchParams ? searchParams.get('id') : null;
  const [isShoppingListSaved, setIsShoppingListSaved] = useState(false);
  const { selectedRecipe, currentShoppingList } = useRecipeContext();
  const { showToast } = useToast(); // Use the Toast context

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
    if (!currentShoppingList || !id || !selectedRecipe) return;

    try {
      if (isShoppingListSaved) {
        await deleteShoppingListFromDB(id);
        setIsShoppingListSaved(false);
        showToast('Shopping list removed successfully!', 'success'); // Use global toast
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
        await saveShoppingListToDB(
          id,
          currentShoppingList,
          selectedRecipe.recipeTitle
        );
        setIsShoppingListSaved(true);
        showToast('Shopping list saved successfully!', 'success'); // Use global toast
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
      showToast('Failed to update shopping list. Please try again.', 'error'); // Use global toast
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

      <div className="mt-4 flex justify-center">
        <button
          onClick={handleShoppingListSaveToggle}
          className={`p-2 px-6 rounded-full flex items-center gap-2 ${
            isShoppingListSaved ? 'bg-pink-800 text-white' : 'bg-sky-50 text-pink-800'
          } shadow-md transition-all duration-200`}
        >
          {isShoppingListSaved ? 'Delete Shopping List' : 'Save Shopping List'}
          <ShoppingCart size={20} />
        </button>
      </div>
    </div>
  );
};
ShoppingList.defaultProps = {
  shoppingListData: { ingredients: [], totalItems: 0 },
  recipeTitle: 'Unknown Recipe',
};

export default ShoppingList;
