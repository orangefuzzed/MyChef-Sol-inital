import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/utils/dbConnect';
import { Collection } from 'mongodb';
import { RecipeDocument } from '../../../models/recipe';

// Connect to MongoDB and handle GET request
export async function GET() {
  try {
    // Make sure to connect to the database
    const db = await connectToDatabase();

    // Fetch all recipes from MongoDB (without filter)
    const recipesCollection: Collection<RecipeDocument> = db.collection('recipes');
    const recipes = await recipesCollection.find({}).toArray();

    // Log how many recipes were fetched
    console.log(`Number of recipes fetched from MongoDB: ${recipes.length}`);

    // Transform `_id` to `id`
    const transformedRecipes = recipes.map((recipe) => ({
      id: recipe._id.toString(),
      recipeTitle: recipe.recipeTitle,
      description: recipe.description,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      imageURL: recipe.imageURL,
      userEmail: recipe.userEmail,
      isSuggestion: recipe.isSuggestion,
    }));

   // Send transformed recipes to the client
return NextResponse.json({ recipes: transformedRecipes });
} catch (error: unknown) {
  if (error instanceof Error) {
    console.error('Error fetching recipes:', error.message);
    return NextResponse.json({ error: 'Failed to fetch recipes', details: error.message }, { status: 500 });
  } else {
    console.error('An unexpected error occurred');
    return NextResponse.json({ error: 'Failed to fetch recipes', details: 'An unexpected error occurred' }, { status: 500 });
  }
}

}
