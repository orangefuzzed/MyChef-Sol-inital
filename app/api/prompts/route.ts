import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/utils/dbConnect';

export async function GET() {
  try {
    const db = await connectToDatabase();

    // Query the sessions collection for random user prompts
    const prompts = await db
      .collection('sessions')
      .aggregate([
        { $unwind: '$messages' }, // Flatten the messages array
        { $match: { 'messages.sender': 'user' } }, // Filter for user-sent messages
        { $project: { text: '$messages.text', timestamp: '$messages.timestamp' } }, // Project the text and timestamp
        { $sample: { size: 20 } } // Fetch 20 random prompts
      ])
      .toArray();

    return NextResponse.json(prompts);
  } catch (error) {
    console.error('Error fetching user prompts:', error);
    return NextResponse.json({ error: 'Failed to fetch user prompts' }, { status: 500 });
  }
}
