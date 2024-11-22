import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import clientPromise from '../../../../lib/mongodb';

export async function POST(req: Request) {
  try {
    const client: MongoClient = await clientPromise;
    const db = client.db();

    // Assuming we have `sessions` collection in MongoDB
    const collection = db.collection('sessions');

    // Parse the incoming JSON body
    const body = await req.json();

    // Insert the data into the MongoDB collection
    const result = await collection.insertOne(body);

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Error saving session to MongoDB:', error);
    return NextResponse.json({ success: false, error: 'Failed to save session' }, { status: 500 });
  }
}
