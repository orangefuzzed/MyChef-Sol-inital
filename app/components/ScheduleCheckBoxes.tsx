'use client';

import React from 'react';
import * as Checkbox from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';

interface ScheduleCheckBoxesProps {
  selectedOptions?: string[]; // Default to an optional prop
  onChange: (options: string[]) => void;
}

const scheduleOptions = [
  'Busy as Hell—Keep It Quick',
  'Balanced—A Mix of Quick and Mid',
  'All the Time in the World!',
  'I can do it all-No Limits!',
];

const ScheduleCheckBoxes: React.FC<ScheduleCheckBoxesProps> = ({
  selectedOptions = [], // Ensure it defaults to an empty array
  onChange,
}) => {
  const handleCheckboxChange = (option: string) => {
    if (selectedOptions.includes(option)) {
      // Remove the option if it’s already selected
      onChange(selectedOptions.filter((o) => o !== option));
    } else {
      // Add the option if it’s not selected
      onChange([...selectedOptions, option]);
    }
  };

  return (
    <div className="space-y-4">
      {scheduleOptions.map((option) => (
        <div key={option} className="flex items-center space-x-4">
          <Checkbox.Root
            id={option}
            checked={selectedOptions.includes(option)} // Safely use `.includes()`
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

export default ScheduleCheckBoxes;
