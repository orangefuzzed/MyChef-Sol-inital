// app/api/recipes/sync/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../../utils/dbConnect';


export async function POST(req: NextRequest) {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('recipes');

    const { recipes } = await req.json();
    if (!recipes || !Array.isArray(recipes)) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }

    // Iterate through each recipe and either insert or update it in MongoDB
    for (const recipe of recipes) {
      const query = { id: recipe.id, userEmail: recipe.userEmail }; 
      const update = { $set: recipe };
      const options = { upsert: true };
      await collection.updateOne(query, update, options);
    }


    return NextResponse.json({ message: 'Recipes synced successfully' }, { status: 200 });
  } catch (error) {
    console.error('Failed to sync recipes:', error);
    return NextResponse.json({ error: 'Failed to sync recipes' }, { status: 500 });
  }
}
