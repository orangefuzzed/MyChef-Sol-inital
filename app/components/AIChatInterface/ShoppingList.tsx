import React, { useEffect, useState } from 'react';
import { ShoppingListItem } from '../../../types/ShoppingListItem';
import { Check, ClipboardCopy, FileUp } from 'lucide-react';
import {
  saveShoppingListToDB,
  getSavedShoppingListsFromDB,
} from '../../utils/shoppingListUtils';
import { useRecipeContext } from '../../contexts/RecipeContext';
import { useSearchParams } from 'next/navigation';
import { useToast } from '../../contexts/ToastContext'; // Import the Toast context
import * as Checkbox from '@radix-ui/react-checkbox';

interface ShoppingListProps {
  shoppingListData: {
    ingredients: ShoppingListItem[];
    totalItems: number;
  };
  recipeTitle: string;
  listId: string; // Unique ID for the list
}

const ShoppingList: React.FC<ShoppingListProps> = ({
  shoppingListData,
  recipeTitle,
  listId,
}) => {
  const searchParams = useSearchParams();
  const id = searchParams ? searchParams.get('id') : null;
  const [isShoppingListSaved, setIsShoppingListSaved] = useState(false);
  const { selectedRecipe, currentShoppingList } = useRecipeContext();
  const { showToast } = useToast(); // Use the Toast context
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({}); // Track checked state

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

  const exportToTextFile = (shoppingList: string[]) => {
    const blob = new Blob([shoppingList.join('\n')], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shopping-list.txt'; // Give it a sweet filename!
    a.click();
    window.URL.revokeObjectURL(url); // Clean up after ourselves
  };

  const copyToClipboard = (shoppingList: string[]) => {
    const text = shoppingList.join('\n'); // Format the shopping list as text
    navigator.clipboard
      .writeText(text)
      .then(() => {
        showToast('Shopping list copied to clipboard! 📋✨', 'success'); // TOASTIFIED! 💥
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err);
        showToast('Oops! Failed to copy. Try again. 😓', 'error'); // Toast for failure too
      });
  };

  useEffect(() => {
    const fetchCheckedState = async () => {
      try {
        const savedList = await getSavedShoppingListsFromDB(listId);
        setCheckedItems(savedList?.checkedItems || {});
      } catch (error) {
        console.error('Failed to fetch checked state:', error);
      }
    };

    fetchCheckedState();
  }, [listId]);


  const toggleChecked = (itemName: string) => {
    setCheckedItems((prev) => {
      const updated = { ...prev, [itemName]: !prev[itemName] };

      // Save the updated state to IndexedDB
      saveShoppingListToDB(
        listId,
        {
          ...shoppingListData,
          checkedItems: updated, // Include the updated checked items
        },
        recipeTitle // Pass the recipeTitle as the third argument
      );

      return updated;
    });
  };


  return (
    <div className="shopping-list bg-white/30 backdrop-blur-lg border-white border shadow-lg ring-1 ring-black/5 p-6 rounded-2xl">
        <h2 className="text-2xl font-medium text-sky-50 text-center">
          Shopping List for: {recipeTitle}
        </h2>
        <div className="py-3 flex items-center text-sm text-black before:flex-1 before:border-t before:border-[#00f5d0] before:me-6 after:flex-1 after:border-t after:border-[#00f5d0] after:ms-6 dark:text-white dark:before:border-neutral-600 dark:after:border-neutral-600">
          ITEMS
        </div>
        <ul className="mt-2 list-disc pl-6 space-y-2 text-base">
          {shoppingListData.ingredients.map((item, index) => (
            <li
              key={index}
              className={`flex items-center gap-4 ${checkedItems[item.name] ? 'line-through text-gray-500' : ''
                }`}
            >
              {/* Radix Checkbox */}
              <Checkbox.Root
                id={item.name}
                checked={checkedItems[item.name] || false}
                onCheckedChange={(checked) => toggleChecked(item.name)} // Handle state toggle
                className="w-6 h-6 bg-gray-700 rounded-md flex items-center justify-center border border-gray-500 focus:outline-none focus:ring focus:ring-[#00a39e]"
              >
                <Checkbox.Indicator>
                  <Check className="w-4 h-4 text-[#00a39e]" />
                </Checkbox.Indicator>
              </Checkbox.Root>

              {/* Ingredient Label */}
              <label
                htmlFor={item.name}
                className={`cursor-pointer ${checkedItems[item.name] ? 'text-gray-600' : 'text-white'
                  }`}
              >
                {item.name}
              </label>
            </li>
          ))}
        </ul>

        <p className="mt-6 font-semibold">Total Items: {shoppingListData.totalItems}</p>

        {/* Export to Text File Button */}
      <div className="mt-2 flex items-center">
        <button
          onClick={() =>
            exportToTextFile(
              shoppingListData.ingredients.map((item) => item.name) // Map ingredients to their names
            )
          }
          className="flex items-center justify-center w-full max-w-lg p-2 px-6 bg-[#00a39e]/50 border border-gray-300 shadow-lg ring-1 ring-black/5 rounded-full text-sm font-base text-sky-50 gap-2"
        >
          Export to File <FileUp size={20} strokeWidth={1.5} />
        </button>
      </div>
        {/* Copy to Clipboard Button */}
      <div className="mt-2 flex items-center">
        <button
          onClick={() =>
            copyToClipboard(
              shoppingListData.ingredients.map((item) => item.name) // Map ingredients to their names
            )
          }
          className="flex items-center justify-center w-full max-w-lg p-2 px-6 bg-[#00a39e]/50 border border-gray-300 shadow-lg ring-1 ring-black/5 rounded-full text-sm font-base text-sky-50 gap-2"
        >
          Copy to Clipboard <ClipboardCopy size={20} strokeWidth={1.5} />
        </button>
      </div>
      </div>
      );
};
      ShoppingList.defaultProps = {
        shoppingListData: {ingredients: [], totalItems: 0 },
      recipeTitle: 'Unknown Recipe',
};

      export default ShoppingList;
