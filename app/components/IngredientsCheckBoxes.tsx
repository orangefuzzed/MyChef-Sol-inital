'use client';

import React from 'react';
import * as Checkbox from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';

interface IngredientsCheckBoxesProps {
  selectedIngredients: string[];
  onChange: (ingredients: string[]) => void;
}

const ingredientsOptions = [
  'Basic Pantry Staples', // Placeholder text
  'Some Fancy Stuff', // Replace with actual ingredient options
  'Take Me on a Culinary Adventure!', // Replace with actual ingredient options
  'Whatever-I’m Going Shopping!', // Replace with actual ingredient options
];

const IngredientsCheckBoxes: React.FC<IngredientsCheckBoxesProps> = ({
  selectedIngredients= [],
  onChange,
}) => {
  const handleCheckboxChange = (ingredient: string) => {
    if (selectedIngredients.includes(ingredient)) {
      onChange(selectedIngredients.filter((s) => s !== ingredient));
    } else {
      onChange([...selectedIngredients, ingredient]);
    }
  };

  return (
    <div className="space-y-4">
      {ingredientsOptions.map((ingredient) => (
        <div key={ingredient} className="flex items-center space-x-4">
          <Checkbox.Root
            id={ingredient}
            checked={selectedIngredients.includes(ingredient)}
            onCheckedChange={() => handleCheckboxChange(ingredient)}
            className="w-6 h-6 bg-gray-700 rounded-md flex items-center justify-center border border-gray-500 focus:outline-none focus:ring focus:ring-green-500"
          >
            <Checkbox.Indicator>
              <Check className="w-4 h-4 text-green-400" />
            </Checkbox.Indicator>
          </Checkbox.Root>
          <label htmlFor={ingredient} className="text-gray-300">
            {ingredient}
          </label>
        </div>
      ))}
    </div>
  );
};

export default IngredientsCheckBoxes;
