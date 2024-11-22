import { Db, ObjectId } from 'mongodb';
import { connectToDatabase } from '../app/utils/dbConnect';
import { RecipeDocument } from '../types/RecipeDocument';

export const insertRecipe = async (recipe: RecipeDocument): Promise<void> => {
  const db: Db = await connectToDatabase();
  const collection = db.collection('recipes');

  // Ensure recipeId is set properly
const recipeToInsert = {
  ...recipe,
  recipeId: recipe.recipeId ?? (recipe._id?.toString() ?? ''),  // Use existing recipeId, or fallback to `_id` as `recipeId`, converting ObjectId to string
};


  // If the recipe has an `_id` already, treat it as an update
  if (recipeToInsert._id) {
    await collection.updateOne(
      { _id: recipeToInsert._id },
      { $set: recipeToInsert },
      { upsert: true }
    );
  } else {
    await collection.insertOne(recipeToInsert);
  }
};


// Convert a plain object into a `RecipeDocument`-typed object, including the MongoDB `_id`.
export function convertToRecipeDocument(recipe: any): RecipeDocument {
  return {
    _id: recipe._id ? new ObjectId(recipe._id) : undefined,
    recipeId: recipe.recipeId, // Use recipeId consistently
    recipeTitle: recipe.recipeTitle,
    description: recipe.description,
    ingredients: recipe.ingredients,
    instructions: recipe.instructions,
    imageURL: recipe.imageURL,
    userEmail: recipe.userEmail,
    isSuggestion: recipe.isSuggestion,
    createdAt: recipe.createdAt,
    updatedAt: recipe.updatedAt,
  };
}
