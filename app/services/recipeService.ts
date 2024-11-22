import { RecipeDocument } from '../../types/RecipeDocument';
import { connectToDatabase } from '../utils/dbConnect';
import { Db, ObjectId } from 'mongodb';

// Fetch a recipe by its ID
export async function fetchRecipeById(recipeId: string): Promise<RecipeDocument | null> {
  try {
    const db: Db = await connectToDatabase();
    const collection = db.collection('recipes');
    const recipe = await collection.findOne({ _id: new ObjectId(recipeId) });

    if (!recipe) {
      throw new Error(`Recipe with ID ${recipeId} not found`);
    }

    return recipe as RecipeDocument;
  } catch (error) {
    console.error('Failed to fetch recipe:', error);
    throw new Error('Failed to fetch recipe from the database');
  }
}

// Fetch saved recipes for a specific user
export async function getSavedRecipes(userEmail: string): Promise<RecipeDocument[]> {
  try {
    const db: Db = await connectToDatabase();
    const collection = db.collection('recipes');
    const recipes = await collection.find({ userEmail }).toArray();
    return recipes as RecipeDocument[];
  } catch (error) {
    console.error('Failed to fetch saved recipes:', error);
    throw new Error('Failed to fetch saved recipes from the database');
  }
}

// Save a new recipe for a user
export async function saveRecipe(userEmail: string, recipeData: RecipeDocument): Promise<RecipeDocument> {
  try {
    const db: Db = await connectToDatabase();
    const collection = db.collection('recipes');
    const { _id, ...recipe } = recipeData;

    if (_id) {
      await collection.updateOne(
        { _id: new ObjectId(_id) },
        { $set: { ...recipe, updatedAt: new Date() } },
        { upsert: true }
      );
    } else {
      const newRecipe = { ...recipe, userEmail, createdAt: new Date(), updatedAt: new Date() };
      const insertResult = await collection.insertOne(newRecipe);
      return { ...recipeData, _id: insertResult.insertedId } as RecipeDocument;
    }

    return { ...recipeData, _id } as RecipeDocument;
  } catch (error) {
    console.error('Failed to save recipe:', error);
    throw new Error('Failed to save recipe to the database');
  }
}

// Delete a recipe by its ID for a specific user
export async function deleteRecipe(recipeId: string, userEmail: string): Promise<{ message: string }> {
  try {
    const db: Db = await connectToDatabase();
    const collection = db.collection('recipes');
    const deletedRecipe = await collection.findOneAndDelete({ _id: new ObjectId(recipeId), userEmail });

    if (!deletedRecipe) {
      throw new Error(`Recipe with ID ${recipeId} not found for user ${userEmail}`);
    }
    
    if (!deletedRecipe.value) {
      throw new Error(`Recipe with ID ${recipeId} is missing value for user ${userEmail}`);
    }
    

    return { message: 'Recipe successfully deleted' };
  } catch (error) {
    console.error('Failed to delete recipe:', error);
    throw new Error('Failed to delete recipe from the database');
  }
}
