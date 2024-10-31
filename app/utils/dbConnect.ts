import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI as string; // Make sure MONGODB_URI is correctly set in .env

let client: MongoClient;
let db: Db;

export const connectToDatabase = async (): Promise<Db> => {
  if (db) return db;

  if (!client) {
    client = new MongoClient(uri); // No additional options needed for v4 and above
    await client.connect();
  }

  db = client.db(); // Default database as defined in URI
  return db;
};


