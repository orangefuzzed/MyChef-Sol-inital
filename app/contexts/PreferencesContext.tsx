'use client';

import React, { createContext, useContext, useState, useEffect, Dispatch, SetStateAction } from 'react';

interface Preferences {
  adventureScale: number;
  dietaryRestrictions: string[];
  cookingStyle: string[];
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
    adventureScale: 2,
    dietaryRestrictions: [],
    cookingStyle: [],
  });

  const fetchPreferences = async () => {
    try {
      const response = await fetch('/api/preferences');
      if (response.ok) {
        const data = await response.json();
        if (data.preferences) {
          setPreferences(data.preferences);
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
