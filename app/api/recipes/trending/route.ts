import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/utils/dbConnect';

export async function GET(request: Request) {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('recipes');

    // Use MongoDB's $sample to fetch 20 random recipes
    const trendingRecipes = await collection.aggregate([{ $sample: { size: 20 } }]).toArray();

    // Deduplicate by recipe.id field
    const seenIds = new Set<string>();
    const uniqueRecipes = [];

    for (const recipe of trendingRecipes) {
      if (!seenIds.has(recipe.id)) {
        seenIds.add(recipe.id);
        uniqueRecipes.push(recipe);
      }
    }

    return NextResponse.json(uniqueRecipes);

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error fetching recipes:', error.message);
      return NextResponse.json(
        { error: 'Failed to fetch recipes', details: error.message },
        { status: 500 }
      );
    } else {
      console.error('An unexpected error occurred');
      return NextResponse.json(
        { error: 'Failed to fetch recipes', details: 'An unexpected error occurred' },
        { status: 500 }
      );
    }
  }
}
