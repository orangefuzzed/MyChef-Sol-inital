import { Db } from 'mongodb';

export interface IUserPreferences {
  userEmail: string;
  adventureScale: number;
  dietaryRestrictions: string[];
  cookingStyle: string[];
}

export const getUserPreferencesCollection = async (db: Db) => {
  return db.collection<IUserPreferences>('userPreferences');
};
