// app/types/interfaces.ts

// Define UserPreferencesInterface
export interface UserPreferencesInterface {
    cuisinePreferences?: string[];
    dietaryPreferences?: string[];
    cookingDifficultyPreferences?: string[];
    interactionPreferences?: string[];
    dietaryRestrictions?: { name: string; isAllergy: boolean }[];
    mealPlanning?: string;
    diets?: string;
    familyConsiderations?: string;
    cookingMethods?: string[];
    wholeFood?: boolean;
    seasonality?: boolean;
    userGoals?: string;
    wellnessImportance?: number;
    interactionImportance?: number;
    experienceMapping?: string[];
    generalPreferencesNotes?: string;
    mealPlanningNotes?: string;
    cookingPreferencesNotes?: string;
    wellnessNotes?: string;
    experienceMappingNotes?: string;
  }
  