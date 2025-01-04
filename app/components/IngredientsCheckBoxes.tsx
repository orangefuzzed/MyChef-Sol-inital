'use client';

import React from 'react';
import * as Checkbox from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';

interface IngredientsCheckBoxesProps {
  selectedIngredients: string[];
  onChange: (ingredients: string[]) => void;
}

const ingredientsOptions = [
  'Basic Pantry Staples',
  'Some Fancy Stuff',
  'Take Me on a Culinary Adventure!',
  'Whatever—I’m Going Shopping!',
];

const IngredientsCheckBoxes: React.FC<IngredientsCheckBoxesProps> = ({
  selectedIngredients = [],
  onChange,
}) => {
  const handleCheckboxChange = (ingredient: string, checked: boolean) => {
    if (checked) {
      onChange([...selectedIngredients, ingredient]); // Add ingredient
    } else {
      onChange(selectedIngredients.filter((s) => s !== ingredient)); // Remove ingredient
    }
  };

  return (
    <div>
    <h4 className="mb-2 text-lg font-semibold text-gray-200">
        What’s In your Pantry?
    </h4>
    <p className="mb-4 text-sm text-gray-400">
      Typical Ingredients Considerations...
    </p>
    <div className="space-y-4">
      {ingredientsOptions.map((ingredient) => (
        <div key={ingredient} className="flex items-center space-x-4">
          <Checkbox.Root
            id={ingredient}
            checked={selectedIngredients.includes(ingredient)}
            onCheckedChange={(checked) => handleCheckboxChange(ingredient, !!checked)} // Pass checked state
            className="w-6 h-6 bg-gray-700 rounded-md flex items-center justify-center border border-gray-500 focus:outline-none focus:ring focus:ring-green-500"
          >
            <Checkbox.Indicator>
              <Check className="w-4 h-4 text-[#00a39e]" />
            </Checkbox.Indicator>
          </Checkbox.Root>
          <label htmlFor={ingredient} className="text-gray-300">
            {ingredient}
          </label>
        </div>
      ))}
    </div>
    </div>
  );
};

export default IngredientsCheckBoxes;
