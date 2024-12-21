// app/api/shopping-lists/route.ts

import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/utils/dbConnect';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';


// Connect to MongoDB and handle GET, POST, DELETE requests for Shopping Lists

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const userEmail = session.user.email;
    const { searchParams } = new URL(request.url);
    const shoppingListId = searchParams.get('shoppingListId');

    const db = await connectToDatabase();
    const collection = db.collection('shoppingLists');

    let shoppingLists;
    if (shoppingListId) {
      // Fetch a single shopping list by `shoppingListId`
      const shoppingList = await collection.findOne({ shoppingListId, userEmail });
      if (!shoppingList) {
        return NextResponse.json({ error: 'Shopping list not found' }, { status: 404 });
      }
      shoppingLists = shoppingList;
    } else {
      // Fetch all shopping lists for the user
      shoppingLists = await collection.find({ userEmail }).toArray();
    }

    return NextResponse.json(shoppingLists);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error fetching shopping lists:', error.message);
      return NextResponse.json({ error: 'Failed to fetch shopping lists', details: error.message }, { status: 500 });
    } else {
      console.error('An unexpected error occurred');
      return NextResponse.json({ error: 'Failed to fetch shopping lists', details: 'An unexpected error occurred' }, { status: 500 });
    }
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const userEmail = session.user.email;
    const db = await connectToDatabase();
    const collection = db.collection('shoppingLists');
    const shoppingList = await request.json();

    const shoppingListToInsert = {
      ...shoppingList,
      userEmail,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(shoppingListToInsert);

    return NextResponse.json({ message: 'Shopping list added successfully', shoppingListId: result.insertedId });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error adding shopping list:', error.message);
      return NextResponse.json({ error: 'Failed to add shopping list', details: error.message }, { status: 500 });
    } else {
      console.error('An unexpected error occurred');
      return NextResponse.json({ error: 'Failed to add shopping list', details: 'An unexpected error occurred' }, { status: 500 });
    }
  }
}

export async function DELETE(request: Request) {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const userEmail = session.user.email;
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id'); // Update to match the `id` field in MongoDB

    console.log('DELETE Request Params:', searchParams.toString()); // Debug log

    if (!id) {
      return NextResponse.json({ error: 'Shopping List ID is required' }, { status: 400 });
    }

    const db = await connectToDatabase();
    const collection = db.collection('shoppingLists');

    // Match the document by `id` and `userEmail`
    const result = await collection.deleteOne({ id, userEmail });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Shopping list not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Shopping list deleted successfully' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error deleting shopping list:', error.message);
      return NextResponse.json({ error: 'Failed to delete shopping list', details: error.message }, { status: 500 });
    } else {
      console.error('An unexpected error occurred');
      return NextResponse.json({ error: 'Failed to delete shopping list', details: 'An unexpected error occurred' }, { status: 500 });
    }
  }
}

