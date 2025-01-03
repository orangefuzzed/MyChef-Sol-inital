'use client';

import React from 'react';
import { Check, Pizza } from 'lucide-react';

interface PreferencesPreviewProps {
  preferences: {
    adventureScale: number;
    dietaryRestrictions: string[];
    cookingStyle: string[];
  };
  onSavePreferences: () => void; // Add the prop for saving preferences
}

const PreferencesPreview: React.FC<PreferencesPreviewProps> = ({
  preferences,
  onSavePreferences,
}) => {
  const adventureLabels = [
    'Safe & Familiar',
    'Slightly Adventurous',
    'Balanced Adventure',
    'Adventurous',
    'Wild & Bold',
  ];

  return (
    <div className="p-6 rounded-md">
      <p className="text-lg font-semibold text-green-400 mb-4">Your Preferences</p>

      <div className="space-y-4">
        {/* Cooking Style */}
        <div>
          <h4 className="mb-2 text-sm font-semibold text-gray-200">Cooking Style:</h4>
          <div className="space-y-1">
            {preferences.cookingStyle.length ? (
              preferences.cookingStyle.map((style, index) => (
                <div key={index} className="flex text-sm font-base text-sky-50">
                  <Check className="w-4 h-4 mr-2 text-green-400" />
                  {style}
                </div>
              ))
            ) : (
              <p className="text-sm font-base text-sky-50">None selected</p>
            )}
          </div>
        </div>
      </div>

        {/* Adventure Scale */}
        <div>
            <h4 className="my-2 text-sm font-semibold text-gray-200">Adventure Scale:</h4>
            <div className="flex items-center text-sm font-base text-sky-50">
                <Pizza className="w-4 h-4 mr-2 text-green-400" /> {/* Pizza icon */}
                {adventureLabels[preferences.adventureScale - 1] || 'Not set'}
            </div>
        </div>

        {/* Dietary Restrictions */}
        <div>
          <h4 className="my-2 text-sm font-semibold text-gray-200">Dietary Restrictions:</h4>
          <div className="space-y-1">
            {preferences.dietaryRestrictions.length ? (
              preferences.dietaryRestrictions.map((restriction, index) => (
                <div key={index} className="flex text-sm font-base text-sky-50">
                  <Check className="w-4 h-4 mr-2 text-green-400" />
                  {restriction}
                </div>
              ))
            ) : (
              <p className="text-sm font-base text-sky-50">None</p>
            )}
          </div>
        </div>

      {/* Save Preferences Button */}
      <div className="text-center mt-6">
        <button
          onClick={onSavePreferences}
          className="mt-6 p-2 px-6 bg-pink-800/50 border border-sky-50 shadow-lg ring-1 ring-black/5 rounded-full text-sm text-sky-50 flex items-center gap-2"
        >
          Update Preferences
        </button>
      </div>
    </div>
  );
};

export default PreferencesPreview;
