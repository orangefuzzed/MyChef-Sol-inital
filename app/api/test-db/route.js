import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

export async function GET() {
  try {
    console.log("MongoDB URI in route:", process.env.MONGODB_URI);
    const client = await clientPromise;
    const db = client.db("recipe-meal-app");
    
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);

    return NextResponse.json({ message: "Connected to MongoDB", collections: collectionNames });
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json({ 
      message: "Failed to connect to MongoDB", 
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}