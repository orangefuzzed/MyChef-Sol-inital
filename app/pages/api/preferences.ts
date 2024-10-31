import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../utils/dbConnect';
import UserPreferences from '../../../models/userPreferences';
import { getSession } from 'next-auth/react';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const userEmail = session.user?.email;
  
  if (!userEmail) {
    return res.status(400).json({ message: 'User email not found' });
  }

  switch (req.method) {
    case 'GET':
      try {
        const preferences = await UserPreferences.findOne({ userEmail });
        if (!preferences) {
          return res.status(404).json({ message: 'Preferences not found' });
        }
        res.status(200).json(preferences);
      } catch (error) {
        res.status(500).json({ message: 'Server error', error });
      }
      break;

    case 'POST':
      try {
        const { preferences } = req.body;

        if (!preferences) {
          return res.status(400).json({ message: 'Invalid preferences data' });
        }

        const updatedPreferences = await UserPreferences.findOneAndUpdate(
          { userEmail },
          { preferences },
          { new: true, upsert: true }
        );

        res.status(200).json(updatedPreferences);
      } catch (error) {
        res.status(500).json({ message: 'Server error', error });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
