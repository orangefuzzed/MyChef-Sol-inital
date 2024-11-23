// types/ShoppingList.ts

import { ShoppingListItem } from './ShoppingListItem';

export interface ShoppingList {
  recipeId: string; // Unique identifier for the recipe this shopping list is associated with
  recipeTitle: string; // Title for the shopping list (e.g., 'Beef Tacos Shopping List')
  items: ShoppingListItem[]; // Array of shopping list items
  totalItems: number; // Total number of items in the list
}
