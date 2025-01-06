// types/ShoppingList.ts

import { ShoppingListItem } from './ShoppingListItem';

export interface ShoppingList {
  id: string;
  ingredients: ShoppingListItem[];
  totalItems: number;
  checkedItems?: Record<string, boolean>; // Add this optional field
  recipeTitle?: string; // Include the recipe title for completeness
}
