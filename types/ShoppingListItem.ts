// types/ShoppingListItem.ts

export interface ShoppingListItem {
  name: string; // Name of the ingredient
  quantity?: number; // Quantity of the item (optional, because some may not have a quantity)
  unit?: string; // Unit of measurement (e.g., 'g', 'ml', 'cup', etc.) (optional)
}
