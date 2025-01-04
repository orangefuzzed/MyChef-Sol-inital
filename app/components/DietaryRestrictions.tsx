'use client';

import React from 'react';
import * as Checkbox from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';

interface DietaryRestrictionsProps {
  selectedRestrictions: string[];
  onChange: (restrictions: string[]) => void;
}

const dietaryOptions = {
  Allergies: [
    'Gluten-Free',
    'Dairy-Free',
    'Nut-Free',
    'Shellfish-Free',
    'Soy-Free',
    'Egg-Free',
  ],
  Medical: [
    'Low-Sodium',
    'Low-Sugar',
    'Keto-Friendly',
    'Diabetic-Friendly',
  ],
  Lifestyle: [
    'Vegan',
    'Vegetarian',
    'Pescatarian',
    'Paleo',
    'Raw Food',
  ],
  ReligiousCultural: [
    'Halal',
    'Kosher',
    'Asian Vegetarian',
    'Jain',
  ],
};

const DietaryRestrictions: React.FC<DietaryRestrictionsProps> = ({
  selectedRestrictions = [],
  onChange,
}) => {
  const handleCheckboxChange = (restriction: string) => {
    if (selectedRestrictions.includes(restriction)) {
      onChange(selectedRestrictions.filter((r) => r !== restriction));
    } else {
      onChange([...selectedRestrictions, restriction]);
    }
  };

  return (
    <div>
    <h4 className="mb-2 text-md font-semibold text-gray-200">
      Dietary Restrictions
    </h4>
    <p className="mb-2 text-sm text-gray-400">
      Tailor Your Recipes to Fit Your Needs.
    </p>
    <div className="space-y-4">
      {Object.entries(dietaryOptions).map(([category, options]) => (
        <div key={category}>
          <h4 className="mb-2 text-sm font-semibold text-gray-200">{category}:</h4>
          <div className="grid grid-cols-2 gap-2">
            {options.map((restriction) => (
              <div key={restriction} className="flex items-center space-x-2">
                <Checkbox.Root
                  id={restriction}
                  checked={selectedRestrictions.includes(restriction)}
                  onCheckedChange={() => handleCheckboxChange(restriction)}
                  className="w-4 h-4 bg-gray-700 rounded-md flex items-center justify-center border border-gray-500 focus:outline-none focus:ring focus:ring-green-500"
                >
                  <Checkbox.Indicator>
                    <Check className="w-3 h-3 text-[#00a39e]" />
                  </Checkbox.Indicator>
                </Checkbox.Root>
                <label htmlFor={restriction} className="text-gray-300">
                  {restriction}
                </label>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
    </div>
  );
};

export default DietaryRestrictions;
