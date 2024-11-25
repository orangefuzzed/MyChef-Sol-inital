import { ObjectId } from 'mongodb';

export interface RecipeDocument {
  _id?: ObjectId; // MongoDB ObjectId
  id: string; // User-friendly recipe ID, i.e., what Claude sends
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

