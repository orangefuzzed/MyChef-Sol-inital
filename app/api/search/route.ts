import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/utils/dbConnect';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const db = await connectToDatabase();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const options: string[] = JSON.parse(searchParams.get('options') || '[]');
    const userEmail = session.user.email;

    let results: any[] = []; // Explicitly typed to resolve the TS flag

    // Search in "My Stuff" (user's collections)
    if (options.includes('myStuff')) {
      const collections = ['dishcoveryCategories', 'savedRecipes', 'favorites', 'shoppingLists'];
      for (const collectionName of collections) {
        const collection = db.collection(collectionName);
        const items = await collection
          .find({
            userEmail,
            $or: [
              { recipeTitle: { $regex: query, $options: 'i' } }, // Match recipe titles
              { description: { $regex: query, $options: 'i' } }, // Match categories
            ],
          })
          .sort({ recipeTitle: 1 }) // Alphabetical sort
          .toArray();
        results = results.concat(items);
      }
    }

    // Search Prompts
    if (options.includes('prompts')) {
        const prompts = await db
        .collection('sessions')
        .aggregate([
            { $unwind: '$messages' }, // Flatten the messages array
            { 
            $match: { 
                'messages.sender': 'user', // Filter for user-sent messages
                'messages.text': { $regex: query, $options: 'i' }, // Match query in message text
            } 
            },
            { $project: { text: '$messages.text', timestamp: '$messages.timestamp' } }, // Project text and timestamp
            { $sort: { 'messages.timestamp': -1 } }, // Sort by the latest prompts
        ])
        
        .toArray();
    
        results = results.concat(prompts); // Append prompts to results
    }
  

   // Search Recipes (global recipe collection)
    if (options.includes('recipes')) {
        const recipesCollection = db.collection('recipes');
    
        try {
        const recipes = await recipesCollection
            .find({
            $or: [
                { recipeTitle: { $regex: query, $options: 'i' } }, // Match by title
                { description: { $regex: query, $options: 'i' } }, // Match by description
            ],
            })
            .sort({ recipeTitle: 1 }) // Alphabetical sort
            .toArray();
    
        results = results.concat(recipes);
        } catch (error) {
        console.error('Error fetching recipes:', error);
        }
    }
  

    // Return combined results
    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('Error executing search:', error);
    return NextResponse.json({ error: 'Failed to execute search' }, { status: 500 });
  }
}
