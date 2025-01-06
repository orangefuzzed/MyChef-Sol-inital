import { Db, ObjectId } from 'mongodb';
import { connectToDatabase } from '../app/utils/dbConnect';
import { RecipeDocument } from '../types/RecipeDocument';

export const insertRecipe = async (recipe: RecipeDocument): Promise<void> => {
  const db: Db = await connectToDatabase();
  const collection = db.collection('recipes');

  const recipeToInsert = {
    ...recipe,
    id: recipe.id ?? (recipe._id?.toString() ?? ''),
    category: recipe.category || 'Uncategorized', // Default to "Uncategorized" if not provided
  };

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
    id: recipe.id, // Change recieId to id for consistency
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

