import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/utils/dbConnect';

export async function GET(request: Request) {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('savedRecipes');

      // Use MongoDB's $sample to fetch 20 random recipes
    const recentRecipes = await collection.aggregate([{ $sample: { size: 20 } }]).toArray();

    return NextResponse.json(recentRecipes);
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
