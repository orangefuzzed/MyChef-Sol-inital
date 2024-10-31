import { Db, ObjectId } from 'mongodb';
import { connectToDatabase } from '../app/utils/dbConnect';

export const insertRecipe = async (recipe: RecipeDocument): Promise<void> => {
  const db: Db = await connectToDatabase();
  const collection = db.collection('recipes');

  // If the recipe has an `_id` already, treat it as an update
  if (recipe._id) {
    await collection.updateOne(
      { _id: recipe._id },
      { $set: recipe },
      { upsert: true }
    );
  } else {
    await collection.insertOne(recipe);
  }
};

export interface RecipeDocument {
  _id?: ObjectId;
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

// Convert a plain object into a `RecipeDocument`-typed object, including the MongoDB `_id`.
export function convertToRecipeDocument(recipe: any): RecipeDocument {
  return {
    _id: recipe._id ? new ObjectId(recipe._id) : undefined,
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
