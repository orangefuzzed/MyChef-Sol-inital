// app/api/recipes/favorites/route.ts

import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/utils/dbConnect';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';


// Connect to MongoDB and handle GET, POST, DELETE requests for Favorites

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const userEmail = session.user.email;
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const db = await connectToDatabase();
    const collection = db.collection('favorites');

    let favorites;
    if (id) {
      // Fetch a single favorite by `id`
      const favorite = await collection.findOne({ id, userEmail });
      if (!favorite) {
        return NextResponse.json({ error: 'Favorite not found' }, { status: 404 });
      }
      favorites = favorite;
    } else {
      // Fetch all favorites for the user
      favorites = await collection.find({ userEmail }).toArray();
    }

    return NextResponse.json(favorites);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error fetching favorites:', error.message);
      return NextResponse.json({ error: 'Failed to fetch favorites', details: error.message }, { status: 500 });
    } else {
      console.error('An unexpected error occurred');
      return NextResponse.json({ error: 'Failed to fetch favorites', details: 'An unexpected error occurred' }, { status: 500 });
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
    const collection = db.collection('favorites');
    const favorite = await request.json();

    const favoriteToInsert = {
      ...favorite,
      userEmail,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(favoriteToInsert);

    return NextResponse.json({ message: 'Favorite added successfully', favoriteId: result.insertedId });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error adding favorite:', error.message);
      return NextResponse.json({ error: 'Failed to add favorite', details: error.message }, { status: 500 });
    } else {
      console.error('An unexpected error occurred');
      return NextResponse.json({ error: 'Failed to add favorite', details: 'An unexpected error occurred' }, { status: 500 });
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
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const db = await connectToDatabase();
    const collection = db.collection('favorites');

    const result = await collection.deleteOne({ id, userEmail });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Favorite not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Favorite deleted successfully' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error deleting favorite:', error.message);
      return NextResponse.json({ error: 'Failed to delete favorite', details: error.message }, { status: 500 });
    } else {
      console.error('An unexpected error occurred');
      return NextResponse.json({ error: 'Failed to delete favorite', details: 'An unexpected error occurred' }, { status: 500 });
    }
  }
}
