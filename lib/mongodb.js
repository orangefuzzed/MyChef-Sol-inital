import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {}; // Remove deprecated options

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

export async function getDatabase() {
  try {
    const client = await clientPromise;
    return client.db();
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    throw new Error('Database connection failed');
  }
}

export async function getSavedRecipesCollection() {
  try {
    const db = await getDatabase();
    return db.collection('savedRecipes');
  } catch (error) {
    console.error('Failed to get savedRecipes collection:', error);
    throw new Error('Failed to access savedRecipes collection');
  }
}