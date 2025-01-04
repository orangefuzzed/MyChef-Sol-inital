'use client';

import React from 'react';
import * as Checkbox from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';

interface CookingStyleCheckboxesProps {
  selectedStyles: string[];
  onChange: (styles: string[]) => void;
}

const cookingStyles = [
  'Just Me',
  'Me + Partner',
  'Family of 4',
  'Feeding the Football Team',
];

const CookingStyleCheckboxes: React.FC<CookingStyleCheckboxesProps> = ({
  selectedStyles,
  onChange,
}) => {
  const handleCheckboxChange = (style: string) => {
    if (selectedStyles.includes(style)) {
      // Remove the style if it’s already selected
      onChange(selectedStyles.filter((s) => s !== style));
    } else {
      // Add the style if it’s not selected
      onChange([...selectedStyles, style]);
    }
  };

  return (
    <div className="space-y-4">
      {cookingStyles.map((style) => (
        <div key={style} className="flex items-center space-x-4">
          <Checkbox.Root
            id={style}
            checked={selectedStyles.includes(style)}
            onCheckedChange={() => handleCheckboxChange(style)}
            className="w-6 h-6 bg-gray-700 rounded-md flex items-center justify-center border border-gray-500 focus:outline-none focus:ring focus:ring-green-500"
          >
            <Checkbox.Indicator>
              <Check className="w-4 h-4 text-green-400" />
            </Checkbox.Indicator>
          </Checkbox.Root>
          <label htmlFor={style} className="text-gray-300">
            {style}
          </label>
        </div>
      ))}
    </div>
  );
};

export default CookingStyleCheckboxes;
