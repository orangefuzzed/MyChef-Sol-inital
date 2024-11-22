import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import clientPromise from '../../../../lib/mongodb';

export async function GET() {
  try {
    const client: MongoClient = await clientPromise;
    const db = client.db();

    // Assuming we have `sessions` collection in MongoDB
    const collection = db.collection('sessions');

    // Fetch all saved sessions
    const savedSessions = await collection.find({}).toArray();

    return NextResponse.json(savedSessions);
  } catch (error) {
    console.error('Error fetching saved sessions from MongoDB:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch saved sessions' }, { status: 500 });
  }
}
