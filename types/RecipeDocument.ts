export interface RecipeObject {
  id: string; 
  recipeTitle: string; 
  description?: string;
  mainIngredient?: string;
  spicinessLevel?: string;
  ingredients: string[];
  instructions: string[];
  imageURL?: string;
  userEmail: string;
  isSuggestion?: boolean;
}

export type RecipeDocument = RecipeObject & Document;
