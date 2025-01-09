'use client';

import React from 'react';
import { Globe, Ruler, Users, Timer, Ham, WheatOff } from 'lucide-react';

interface PreferencesPreviewProps {
  preferences: {
    dietaryRestrictions: string[];
    cookingStyle: string[];
    schedule: string[]; // New schedule preferences
    ingredients: string[]; // New pantry preferences
    location?: {
      country?: string; // Optional country
      measurementSystem?: string; // Optional measurement system
    };
  };
  onSavePreferences: () => void; // Add the prop for saving preferences
}

const PreferencesPreview: React.FC<PreferencesPreviewProps> = ({
  preferences,
  onSavePreferences,
}) => {
  return (
    <div className="p-6 rounded-md">
      <p className="text-lg font-light text-[#00a39e] mb-4">Review Your Preferences</p>

      <div className="space-y-4">
        {/* Who's In Your Kitchen */}
        <div>
          <h4 className="mb-2 text-sm font-semibold text-gray-200">Who's In Your Kitchen?:</h4>
          <div className="space-y-1">
            {preferences.cookingStyle.length ? (
              preferences.cookingStyle.map((style, index) => (
                <div key={index} className="flex text-sm font-base text-sky-50">
                  <Users className="w-4 h-4 mr-2 text-[#00a39e]" />
                  {style}
                </div>
              ))
            ) : (
              <p className="text-sm font-base text-sky-50">None selected</p>
            )}
          </div>
        </div>

        {/* How's Your Schedule */}
        <div>
          <h4 className="my-2 text-sm font-semibold text-gray-200">How's Your Schedule?:</h4>
          <div className="space-y-1">
            {preferences.schedule.length ? (
              preferences.schedule.map((option, index) => (
                <div key={index} className="flex text-sm font-base text-sky-50">
                  <Timer className="w-4 h-4 mr-2 text-[#00a39e]" />
                  {option}
                </div>
              ))
            ) : (
              <p className="text-sm font-base text-sky-50">None selected</p>
            )}
          </div>
        </div>

        {/* What's in Your Pantry */}
        <div>
            <h4 className="my-2 text-sm font-semibold text-gray-200">What's in Your Pantry?:</h4>
            <div className="space-y-1">
                {preferences.ingredients && preferences.ingredients.length > 0 ? ( // Safeguard check
                preferences.ingredients.map((item, index) => (
                    <div key={index} className="flex text-sm font-base text-sky-50">
                    <Ham className="w-4 h-4 mr-2 text-[#00a39e]" />
                    {item}
                    </div>
                ))
                ) : (
                <p className="text-sm font-base text-sky-50">None selected</p>
                )}
            </div>
        </div>

        {/* Location Preferences */}
        <div>
            <h4 className="my-2 text-sm font-semibold text-gray-200">Location Preferences:</h4>
            <div className="space-y-1">
                {preferences.location ? (
                    <>
                        {/* Country */}
                        <div className="flex text-sm font-base text-sky-50">
                            <Globe className="w-4 h-4 mr-2 text-[#00a39e]" />
                            <span>Country: {preferences.location.country || 'Not specified'}</span>
                        </div>
                        {/* Measurement System */}
                        <div className="flex text-sm font-base text-sky-50">
                            <Ruler className="w-4 h-4 mr-2 text-[#00a39e]" />
                            <span>
                                Measurement System: {preferences.location.measurementSystem || 'Not specified'}
                            </span>
                        </div>
                    </>
                ) : (
                    <p className="text-sm font-base text-sky-50">None selected</p>
                )}
            </div>
        </div>


        {/* Dietary Restrictions */}
        <div>
          <h4 className="my-2 text-sm font-semibold text-gray-200">Dietary Restrictions:</h4>
          <div className="space-y-1">
            {preferences.dietaryRestrictions.length ? (
              preferences.dietaryRestrictions.map((restriction, index) => (
                <div key={index} className="flex text-sm font-base text-sky-50">
                  <WheatOff className="w-4 h-4 mr-2 text-[#00a39e]" />
                  {restriction}
                </div>
              ))
            ) : (
              <p className="text-sm font-base text-sky-50">None</p>
            )}
          </div>
        </div>
    </div>

      {/* Save Preferences Button */}
      <div className="text-center mt-6">
        <button
          onClick={onSavePreferences}
          className="justify-items-center w-full p-2 px-6 bg-pink-800/50 border border-sky-50 shadow-lg ring-1 ring-black/5 rounded-full text-sm text-sky-50"
        >
          Update Preferences
        </button>
      </div>
    </div>
  );
};

export default PreferencesPreview;
