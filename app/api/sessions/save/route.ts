import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import clientPromise from '../../../../lib/mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
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

    // Parse the incoming JSON body
    const body = await req.json();

    // Add userEmail to the session object
    const sessionData = {
      ...body,
      userEmail,
    };

    // Insert the data into the MongoDB collection
    const collection = db.collection('sessions');
    const result = await collection.insertOne(sessionData);

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Error saving session to MongoDB:', error);
    return NextResponse.json({ success: false, error: 'Failed to save session' }, { status: 500 });
  }
}
