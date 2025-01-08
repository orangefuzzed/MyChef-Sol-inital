// app/api/recipes/details/route.ts

import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/utils/dbConnect';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const recipeId = searchParams.get('id'); // Fetch the recipeId from query params

    if (!recipeId) {
      return NextResponse.json({ error: 'Recipe ID is required' }, { status: 400 });
    }

    const db = await connectToDatabase();
    const recipe = await db.collection('recipes').findOne({ id: recipeId }); // Match by `id`

    if (!recipe) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    }

    return NextResponse.json(recipe); // Return the full recipe object
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    return NextResponse.json({ error: 'Failed to fetch recipe details' }, { status: 500 });
  }
}
