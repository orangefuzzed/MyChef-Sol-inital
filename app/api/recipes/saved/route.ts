// Updated app/api/recipes/saved/route.ts to correctly handle recipes and saved recipes

import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/utils/dbConnect';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// Connect to MongoDB and handle GET request
export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const userEmail = session.user.email;
    const { searchParams } = new URL(request.url);
    const recipeId = searchParams.get('recipeId');

    const db = await connectToDatabase();
    let collection;

    // Determine which collection to search based on whether a recipeId is provided
    if (recipeId) {
      collection = db.collection('recipes');
      const recipe = await collection.findOne({ recipeId });
      if (!recipe) {
        return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
      }
      return NextResponse.json(recipe);
    } else {
      collection = db.collection('savedRecipes');
      const recipes = await collection.find({ userEmail }).toArray();
      return NextResponse.json(recipes);
    }
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

// Handle POST request to save a recipe to the savedRecipes collection
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const userEmail = session.user.email;
    const db = await connectToDatabase();
    const collection = db.collection('savedRecipes');

    const recipe = await request.json();
    recipe.userEmail = userEmail; // Add the user's email to the recipe

    // Upsert the recipe to handle duplicates
    await collection.updateOne(
      { recipeId: recipe.recipeId, userEmail },
      { $set: recipe },
      { upsert: true }
    );

    return NextResponse.json({ message: 'Recipe saved successfully' });
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

// Handle DELETE request to remove a saved recipe
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const userEmail = session.user.email;
    const { searchParams } = new URL(request.url);
    const recipeId = searchParams.get('recipeId');

    if (!recipeId) {
      return NextResponse.json({ error: 'Recipe ID is required' }, { status: 400 });
    }

    const db = await connectToDatabase();
    const collection = db.collection('savedRecipes');

    const result = await collection.deleteOne({ recipeId, userEmail });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Recipe deleted successfully' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error deleting recipe:', error.message);
      return NextResponse.json({ error: 'Failed to delete recipe', details: error.message }, { status: 500 });
    } else {
      console.error('An unexpected error occurred');
      return NextResponse.json({ error: 'Failed to delete recipe', details: 'An unexpected error occurred' }, { status: 500 });
    }
  }
}
