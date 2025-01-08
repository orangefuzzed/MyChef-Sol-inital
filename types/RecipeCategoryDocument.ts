// types/RecipeCategoryDocument.ts
import { ObjectId } from 'mongodb';

export interface RecipeCategoryDocument {
  _id?: ObjectId; // MongoDB ID
  recipeId: string; // The ID of the recipe (matches `recipes` collection)
  userEmail: string; // User who owns the category
  mainCategory: string; // Main category (e.g., "Main Dishes")
  subCategory?: string | null; // Optional subcategory (e.g., "Pasta")
  createdAt: Date; // When this was categorized
  updatedAt?: Date; // Last update timestamp
}
