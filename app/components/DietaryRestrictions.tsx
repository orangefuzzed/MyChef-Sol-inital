'use client';

import React from 'react';
import * as Checkbox from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';

interface DietaryRestrictionsProps {
  selected: string[];
  onChange: (restrictions: string[]) => void;
}

const dietaryOptions = [
  'Gluten-Free',
  'Dairy-Free',
  'Nut-Free',
  'Vegan',
  'Vegetarian',
  'Pescatarian',
];

const DietaryRestrictions: React.FC<DietaryRestrictionsProps> = ({
  selected,
  onChange,
}) => {
  const handleCheckboxChange = (option: string) => {
    if (selected.includes(option)) {
      // Remove the option if it’s already selected
      onChange(selected.filter((item) => item !== option));
    } else {
      // Add the option if it’s not selected
      onChange([...selected, option]);
    }
  };

  return (
    <div className="space-y-4">
      {dietaryOptions.map((option) => (
        <div key={option} className="flex items-center space-x-4">
          <Checkbox.Root
            id={option}
            checked={selected.includes(option)}
            onCheckedChange={() => handleCheckboxChange(option)}
            className="w-6 h-6 bg-gray-700 rounded-md flex items-center justify-center border border-gray-500 focus:outline-none focus:ring focus:ring-green-500"
          >
            <Checkbox.Indicator>
              <Check className="w-4 h-4 text-green-400" />
            </Checkbox.Indicator>
          </Checkbox.Root>
          <label htmlFor={option} className="text-gray-300">
            {option}
          </label>
        </div>
      ))}
    </div>
  );
};

export default DietaryRestrictions;
