import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from './../../../utils/dbConnect';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const db = await connectToDatabase();
  const chatSessions = db.collection('chatSessions');

  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ success: false, message: 'Invalid request data' });
    }

    const bulkOps = messages.map((message) => ({
      updateOne: {
        filter: { sessionId: message.sessionId },
        update: {
          $push: { messages: message },
          $set: { lastActive: new Date() }
        },
        upsert: true, // If session does not exist, create a new one
      },
    }));

    if (bulkOps.length > 0) {
      const result = await chatSessions.bulkWrite(bulkOps);
      console.log('Bulk write result:', result);
      return res.status(200).json({ success: true, message: 'Chat messages synced successfully' });
    } else {
      return res.status(400).json({ success: false, message: 'No valid messages to sync' });
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return res.status(500).json({ success: false, error: errorMessage });
  }
}
