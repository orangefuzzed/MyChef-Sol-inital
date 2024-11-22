// app/api/recipes/save/route.ts

import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/utils/dbConnect';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { RecipeDocument } from '@/types/RecipeDocument';

export async function POST(request: Request) {
  try {
    // Connect to database
    const db = await connectToDatabase();
    const session = await getServerSession(authOptions);

    // Ensure the user is authenticated
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const userEmail = session.user.email;
    const { recipe } = await request.json();

    if (!recipe) {
      return NextResponse.json({ error: 'No recipe provided' }, { status: 400 });
    }

    const collection = db.collection('recipes');

    // Create the recipe document
    const recipeDocument: RecipeDocument = {
      recipeId: recipe.recipeId,
      recipeTitle: recipe.recipeTitle,
      description: recipe.description,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      imageURL: recipe.imageURL,
      userEmail: userEmail,
      isSuggestion: recipe.isSuggestion ?? false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert or update the recipe
    await collection.updateOne(
      { recipeId: recipe.recipeId, userEmail },
      { $set: recipeDocument },
      { upsert: true }
    );

    return NextResponse.json({ success: true, message: 'Recipe saved successfully!' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error saving recipe:', error.message);
      return NextResponse.json({ error: 'Failed to save recipe', details: error.message }, { status: 500 });
    } else {
      console.error('An unexpected error occurred');
      return NextResponse.json({ error: 'Failed to save recipe', details: 'An unexpected error occurred' }, { status: 500 });
    }
  }
}
