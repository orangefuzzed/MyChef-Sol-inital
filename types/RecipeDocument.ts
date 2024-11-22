import { ObjectId } from 'mongodb';

export interface RecipeDocument {
  _id?: ObjectId; // MongoDB ObjectId
  recipeId: string; // Unique user-friendly recipe ID
  recipeTitle: string;
  description?: string;
  ingredients: string[];
  instructions: string[];
  imageURL?: string;
  userEmail: string;
  isSuggestion?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
