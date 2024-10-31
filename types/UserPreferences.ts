export interface UserPreferences {
    dietaryRestrictions: string[];
    cuisinePreference: string[];
    cuisinePreferences?: string[];
    mealsPerDay: number;
    calorieTarget: number;
    allergies: string[];
    cookingSkillLevel: 'beginner' | 'intermediate' | 'advanced';
    cookingTime: 'quick' | 'medium' | 'long';
    familySize: number;
  }
  export interface Recipe {
    title: string;
    description: string;
    ingredients?: string[];
    instructions?: string[];
    teaserDetails?: string; // Adding this line makes it optional
  }
  