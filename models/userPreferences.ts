// Updated file: userPreferences.ts

import { Db } from 'mongodb';

export interface IPreference {
  name: string;
  ranking: number;
}

export interface IDietaryRestriction {
  name: string;
  isAllergy: boolean;
}

export interface IUserPreferences {
  userEmail: string;
  // Ranked Preferences
  cuisinePreferences: IPreference[];
  dietaryPreferences: IPreference[];
  cookingDifficultyPreferences: IPreference[];
  interactionPreferences: IPreference[];
  // Dietary Restrictions
  dietaryRestrictions: IDietaryRestriction[];
  // Other Preferences
  mealPlanning?: string;
  diets?: string;
  familyConsiderations?: string;
  cookingMethods?: string[];
  wholeFood?: string;
  seasonality?: string;
  userGoals?: string;
  wellnessImportance?: number;
  interactionImportance?: number;
  experienceMapping?: string[];
  // Additional Notes Fields
  generalPreferencesNotes?: string;
  mealPlanningNotes?: string;
  cookingPreferencesNotes?: string;
  wellnessNotes?: string;
  experienceMappingNotes?: string;
}

// Function to get the user preferences collection
export const getUserPreferencesCollection = async (db: Db) => {
  return db.collection<IUserPreferences>('userPreferences');
};

// CRUD methods
export const createUserPreferences = async (db: Db, userPreferences: IUserPreferences) => {
  const collection = await getUserPreferencesCollection(db);
  return await collection.insertOne(userPreferences);
};

export const getUserPreferences = async (db: Db, userEmail: string) => {
  const collection = await getUserPreferencesCollection(db);
  return await collection.findOne({ userEmail });
};

export const updateUserPreferences = async (db: Db, userEmail: string, updatedPreferences: Partial<IUserPreferences>) => {
  const collection = await getUserPreferencesCollection(db);
  return await collection.updateOne(
    { userEmail },
    { $set: updatedPreferences },
    { upsert: true }
  );
};

export const deleteUserPreferences = async (db: Db, userEmail: string) => {
  const collection = await getUserPreferencesCollection(db);
  return await collection.deleteOne({ userEmail });
};
