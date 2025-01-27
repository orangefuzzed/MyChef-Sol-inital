import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/utils/dbConnect';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// Handle GET request: Fetch hasCreatedAccount status
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const userEmail = session.user.email;
    const db = await connectToDatabase();
    const collection = db.collection('users');

    // Fetch the user's hasCreatedAccount status
    const user = await collection.findOne({ email: userEmail });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const hasCreatedAccount = user.hasCreatedAccount ?? true; // Default to false if undefined
    return NextResponse.json({ hasCreatedAccount });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error fetching hasCreatedAccount status:', error.message);
      return NextResponse.json(
        { error: 'Failed to fetch hasCreatedAccount status', details: error.message },
        { status: 500 }
      );
    } else {
      console.error('An unexpected error occurred');
      return NextResponse.json(
        { error: 'Failed to fetch hasCreatedAccount status', details: 'An unexpected error occurred' },
        { status: 500 }
      );
    }
  }
}

// Handle POST request: Update hasCreatedAccount status to true (or whatever boolean is passed)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const userEmail = session.user.email;
    const db = await connectToDatabase();
    const collection = db.collection('users');

    // We expect a boolean, e.g. { "hasCreatedAccount": true }
    const { hasCreatedAccount } = await request.json();

    if (typeof hasCreatedAccount !== 'boolean') {
      return NextResponse.json({ error: 'Invalid data. Must be a boolean.' }, { status: 400 });
    }

    // Update the user's hasCreatedAccount status
    const result = await collection.updateOne(
      { email: userEmail },
      { $set: { hasCreatedAccount } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: 'Failed to update hasCreatedAccount status' }, { status: 500 });
    }

    return NextResponse.json({ message: 'hasCreatedAccount status updated successfully' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error updating hasCreatedAccount status:', error.message);
      return NextResponse.json(
        { error: 'Failed to update hasCreatedAccount status', details: error.message },
        { status: 500 }
      );
    } else {
      console.error('An unexpected error occurred');
      return NextResponse.json(
        { error: 'Failed to update hasCreatedAccount status', details: 'An unexpected error occurred' },
        { status: 500 }
      );
    }
  }
}
