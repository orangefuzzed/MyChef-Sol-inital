import { ShoppingListItem } from './../types/ShoppingListItem';

export interface Recipe {
  recipeId: string; // Unique identifier for a recipe
  recipeTitle: string;
  description?: string;
  mainIngredient?: string;
  spicinessLevel?: string;
  ingredients: (string | ShoppingListItem)[]; // Allow strings or objects with name, quantity, and unit
  instructions: string[];
  imageURL?: string;
  userEmail: string;
  isSuggestion?: boolean;
  rating?: number; // Adding rating as an optional property
  protein?: number; // Adding protein as an optional property
  createdAt?: Date; // Adding createdAt as optional
  updatedAt?: Date; // Adding updatedAt as optional
}

// Adding RecipeSuggestionSet interface
export interface RecipeSuggestionSet {
  responseId: string; // Unique identifier for the AI response
  message: string; // The message text provided by the AI
  suggestions: Recipe[]; // The set of recipes suggested by the AI
}
