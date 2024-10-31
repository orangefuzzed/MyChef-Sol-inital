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

// You can add CRUD methods here if needed, e.g., createUserPreferences, updateUserPreferences, etc.