import { Db } from 'mongodb';

export interface IUserPreferences {
  userEmail: string;
  schedule: string[]; // NEW: "How’s Your Schedule?" preferences
  ingredients: string[]; // NEW: "What’s in Your Pantry?" preferences
  dietaryRestrictions: string[];
  cookingStyle: string[];
  location?: {
    country?: string; // Optional country
    measurementSystem?: string; // Optional measurement system
  };
}

export const getUserPreferencesCollection = async (db: Db) => {
  return db.collection<IUserPreferences>('userPreferences');
};
