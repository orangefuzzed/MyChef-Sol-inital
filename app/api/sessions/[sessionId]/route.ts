import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import clientPromise from './../../../../lib/mongodb';

export async function GET(
  _request: Request,
  context: any // Allow dynamic shape for the context
) {
  const { sessionId } = context.params; // Access params dynamically

  try {
    const client: MongoClient = await clientPromise;
    const db = client.db();
    const collection = db.collection('sessions');

    // Fetch the session by sessionId
    const session = await collection.findOne({ sessionId });

    if (!session) {
      return NextResponse.json({ success: false, error: 'Session not found' }, { status: 404 });
    }

    return NextResponse.json(session);
  } catch (error) {
    console.error('Error fetching session from MongoDB:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch session' }, { status: 500 });
  }
}
