export interface Recipe {
  id: string; // This represents the unique identifier for a recipe
  recipeTitle: string;
  description?: string;
  mainIngredient?: string;
  spicinessLevel?: string;
  ingredients: string[];
  instructions: string[];
  imageURL?: string;
  userEmail: string;
  isSuggestion?: boolean;
  rating?: number; // Adding rating as an optional property
  protein?: number; // Adding protein as an optional property
}
