import { RecipeDocument } from '../../types/RecipeDocument';
import { connectToDatabase } from '../utils/dbConnect';
import { Db, ObjectId } from 'mongodb';

// Fetch a recipe by its ID
export async function fetchRecipeById(id: string): Promise<RecipeDocument | null> { // Updated `recipeId` to `id`
  try {
    const db: Db = await connectToDatabase();
    const collection = db.collection('recipes');
    const recipe = await collection.findOne({ _id: new ObjectId(id) }); // Updated `recipeId` to `id`

    if (!recipe) {
      throw new Error(`Recipe with ID ${id} not found`); // Updated `recipeId` to `id`
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
    const { id, ...recipe } = recipeData; // Updated `_id` to `id`

    if (id) { // Updated `_id` to `id`
      await collection.updateOne(
        { _id: new ObjectId(id) }, // Updated `_id` to `id`
        { $set: { ...recipe, updatedAt: new Date() } },
        { upsert: true }
      );
    } else {
      const newRecipe = { ...recipe, userEmail, createdAt: new Date(), updatedAt: new Date() };
      const insertResult = await collection.insertOne(newRecipe);
      return { ...recipeData, _id: insertResult.insertedId } as RecipeDocument; // Updated `_id` to `id`
    }

    return { ...recipeData, id } as RecipeDocument; // Updated `_id` to `id`
  } catch (error) {
    console.error('Failed to save recipe:', error);
    throw new Error('Failed to save recipe to the database');
  }
}

// Delete a recipe by its ID for a specific user
export async function deleteRecipe(id: string, userEmail: string): Promise<{ message: string }> { // Updated `recipeId` to `id`
  try {
    const db: Db = await connectToDatabase();
    const collection = db.collection('recipes');
    const deletedRecipe = await collection.findOneAndDelete({ _id: new ObjectId(id), userEmail }); // Updated `recipeId` to `id`

    if (!deletedRecipe) {
      throw new Error(`Recipe with ID ${id} not found for user ${userEmail}`); // Updated `recipeId` to `id`
    }

    if (!deletedRecipe.value) {
      throw new Error(`Recipe with ID ${id} is missing value for user ${userEmail}`); // Updated `recipeId` to `id`
    }

    return { message: 'Recipe successfully deleted' };
  } catch (error) {
    console.error('Failed to delete recipe:', error);
    throw new Error('Failed to delete recipe from the database');
  }
}
