import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from './../../utils/dbConnect';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const db = await connectToDatabase();
    const chatSessions = db.collection('chatSessions');
  
    const { method } = req;
  
    switch (method) {
      case 'POST':
        // Save a new chat session
        try {
            const result = await chatSessions.insertOne(req.body);
            res.status(201).json({ success: true, data: { insertedId: result.insertedId } });
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            res.status(400).json({ success: false, error: errorMessage });
          }          
        break;
  
      case 'GET':
        // Retrieve chat sessions by userId
        try {
          const { userId } = req.query;
          const sessions = await chatSessions.find({ userId }).toArray();
          res.status(200).json({ success: true, data: sessions });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
          res.status(400).json({ success: false, error: errorMessage });
        }
        break;
  
      case 'PATCH':
        // Update a chat session by sessionId
        try {
            const { sessionId } = req.query;
            const result = await chatSessions.findOneAndUpdate(
              { sessionId },
              { $set: req.body },
              { returnDocument: 'after' }
            );
          
            if (!result || !result.value) {
              res.status(404).json({ success: false, message: 'Chat session not found' });
            } else {
              res.status(200).json({ success: true, data: result.value });
            }
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            res.status(400).json({ success: false, error: errorMessage });
          }
                    
        break;
  
      case 'DELETE':
        // Delete a chat session by sessionId
        try {
          const { sessionId } = req.query;
          await chatSessions.deleteOne({ sessionId });
          res.status(200).json({ success: true });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
          res.status(400).json({ success: false, error: errorMessage });
        }
        break;
  
      default:
        res.setHeader('Allow', ['POST', 'GET', 'PATCH', 'DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
        break;
    }
  }
  
