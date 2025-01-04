'use client';

import React, { createContext, useContext, useState, useEffect, Dispatch, SetStateAction } from 'react';

interface Preferences {

    dietaryRestrictions: string[];
    cookingStyle: string[];
    ingredients: string[]; // Add this
    schedule: string[]; // Add this too
  }
  

// Explicitly export PreferencesContextType
export interface PreferencesContextType {
  preferences: Preferences;
  setPreferences: Dispatch<SetStateAction<Preferences>>;
  fetchPreferences: () => void;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export const PreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [preferences, setPreferences] = useState<Preferences>({

        dietaryRestrictions: [],
        cookingStyle: [],
        ingredients: [], // 🔥 Add this to initialize it properly
        schedule: [], // 🔥 If "schedule" was added, initialize it here too
      });
      

  const fetchPreferences = async () => {
    try {
      const response = await fetch('/api/preferences');
      if (response.ok) {
        const data = await response.json();
        if (data.preferences) {
          setPreferences(data.preferences); // Populate state with fetched preferences
        }
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
    }
  };

  useEffect(() => {
    fetchPreferences();
  }, []);

  return (
    <PreferencesContext.Provider value={{ preferences, setPreferences, fetchPreferences }}>
      {children}
    </PreferencesContext.Provider>
  );
};

// Custom hook for accessing the context
export const usePreferencesContext = (): PreferencesContextType => {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferencesContext must be used within a PreferencesProvider');
  }
  return context;
};
