'use client';

import React, { useState } from 'react';
import * as Checkbox from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';

interface LocationPreferencesProps {
  country: string;
  measurementSystem: string;
  highAltitude: boolean; // Update to boolean for clarity
  onCountryChange: (value: string) => void;
  onMeasurementSystemChange: (value: string) => void;
  onHighAltitudeChange: (value: boolean) => void; // Update handler type
}

const measurementOptions = ['Imperial System (oz, lbs)', 'Metric System (ml, liters)'];

const LocationPreferences: React.FC<LocationPreferencesProps> = ({
  country,
  measurementSystem,
  highAltitude,
  onCountryChange,
  onMeasurementSystemChange,
  onHighAltitudeChange,
}) => {
  const [selectedSystem, setSelectedSystem] = useState(measurementSystem);

  const handleSystemChange = (option: string) => {
    setSelectedSystem(option);
    onMeasurementSystemChange(option);
  };

  const handleHighAltitudeChange = (checked: boolean) => {
    onHighAltitudeChange(checked); // Pass the boolean state to the parent
  };

  return (
    <div>
      <h4 className="mb-2 text-lg font-semibold text-gray-200">My World!</h4>
      <p className="mb-4 text-sm text-gray-400">Location Considerations...</p>

      {/* Country Input */}
      <div className="mb-4">
        <label htmlFor="country" className="block text-gray-300 mb-2">
          Country
        </label>
        <input
          id="country"
          type="text"
          value={country}
          onChange={(e) => onCountryChange(e.target.value)}
          placeholder="Enter your country (e.g., USA, France)"
          className="w-full p-2 bg-gray-700 text-white border border-gray-500 rounded-lg focus:outline-none focus:ring focus:ring-[#00a39e]"
        />
      </div>

      {/* Measurement System Checkboxes */}
      <div className="space-y-4">
        <h4 className="mb-2 text-gray-300">Preferred Measurement System:</h4>
        {measurementOptions.map((option) => (
          <div key={option} className="flex items-center space-x-4">
            <Checkbox.Root
              id={option}
              checked={selectedSystem === option}
              onCheckedChange={() => handleSystemChange(option)}
              className="w-6 h-6 bg-gray-700 rounded-md flex items-center justify-center border border-gray-500 focus:outline-none focus:ring focus:ring-green-500"
            >
              <Checkbox.Indicator>
                <Check className="w-4 h-4 text-[#00a39e]" />
              </Checkbox.Indicator>
            </Checkbox.Root>
            <label htmlFor={option} className="text-gray-300">
              {option}
            </label>
          </div>
        ))}
      </div>

      {/* High Altitude Checkbox */}
      <div className="mt-6">
        <h4 className="mb-2 text-gray-300">High Altitude Adjustment:</h4>
        <div className="flex items-center space-x-4">
          <Checkbox.Root
            id="high-altitude"
            checked={highAltitude}
            onCheckedChange={handleHighAltitudeChange} // Handle boolean state
            className="w-6 h-6 bg-gray-700 rounded-md flex items-center justify-center border border-gray-500 focus:outline-none focus:ring focus:ring-green-500"
          >
            <Checkbox.Indicator>
              <Check className="w-4 h-4 text-[#00a39e]" />
            </Checkbox.Indicator>
          </Checkbox.Root>
          <label htmlFor="high-altitude" className="text-gray-300">
            High Altitude
          </label>
        </div>
      </div>
    </div>
  );
};

export default LocationPreferences;
