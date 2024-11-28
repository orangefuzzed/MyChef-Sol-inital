import React from 'react';
import Link from 'next/link';
import { ExternalLinkIcon } from '@radix-ui/react-icons';
import { Recipe } from '../../../types/Recipe';
import { ShoppingListItem } from './../../../types/ShoppingListItem';

interface ActionCardsProps {
  currentRecipe: Recipe | null;
  currentShoppingList: ShoppingListItem[]; // Adjust type based on actual structure
  currentCookMode: string | null;
  handleAddToMealPlan: () => void;
}

const ActionCards: React.FC<ActionCardsProps> = ({
  currentRecipe,
  currentShoppingList,
  currentCookMode,
  handleAddToMealPlan,
}) => {
  if (!currentRecipe) return null;

  return (
    <div className="action-cards flex gap-4 mt-4">
      {currentShoppingList && (
        <Link
          href={{
            pathname: `/shopping-list`,
            query: { shoppingListData: JSON.stringify(currentShoppingList) },
          }}
        >
          <button className="p-2 px-6 bg-slate-700 rounded-full text-white flex items-center gap-2">
            View Shopping List
            <ExternalLinkIcon className="w-5 h-5" />
          </button>
        </Link>
      )}

      {currentCookMode && (
        <Link
          href={{
            pathname: `/cook-mode`,
            query: { cookModeData: currentCookMode },
          }}
        >
          <button className="p-2 px-6 bg-slate-700 rounded-full text-white flex items-center gap-2">
            View in Cook Mode biff
            <ExternalLinkIcon className="w-5 h-5" />
          </button>
        </Link>
      )}

      <button className="p-2 px-6 bg-slate-700 rounded-full text-white" onClick={handleAddToMealPlan}>
        Add to Meal Plan
      </button>

      <Link
        href={{
          pathname: `/recipe-view`,
          query: { recipeData: JSON.stringify(currentRecipe) },
        }}
      >
        <button className="p-2 px-6 bg-slate-700 rounded-full text-white flex items-center gap-2">
          View Recipe
          <ExternalLinkIcon className="w-5 h-5" />
        </button>
      </Link>
    </div>
  );
};

export default ActionCards;
