import { ObjectId } from 'mongodb';

export interface RecipeDocument {
  _id?: ObjectId; // MongoDB ID
  id: string; // Recipe ID
  recipeTitle: string;
  description?: string;
  ingredients: (string | { name: string; quantity?: number; unit?: string })[];
  instructions: string[];
  imageURL?: string;
  userEmail: string; // The user who saved the recipe
  isSuggestion?: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  // NEW FIELD: Category
  category?: string; // Optional for backward compatibility. Default = "Uncategorized"
}
