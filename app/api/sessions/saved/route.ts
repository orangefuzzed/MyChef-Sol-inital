import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import clientPromise from '../../../../lib/mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const client: MongoClient = await clientPromise;
    const db = client.db();

    // Get the authenticated user's session
    const session = await getServerSession(authOptions);

    // Ensure the user is authenticated
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const userEmail = session.user.email;

    // Fetch all saved sessions for the authenticated user
    const collection = db.collection('sessions');
    const savedSessions = await collection.find({ userEmail }).toArray();

    return NextResponse.json(savedSessions);
  } catch (error) {
    console.error('Error fetching saved sessions from MongoDB:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch saved sessions' }, { status: 500 });
  }
}
