'use client';

import React from 'react';

const styles = ['Fast & Easy', 'Healthy & Balanced', 'I Like a Challenge'];

const CookingStyleDropdown = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) => {
  return (
    <div className="flex flex-col items-center p-6">
      <p className="text-lg font-semibold text-gray-200 mb-4">Cooking Style</p>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-gray-700 text-gray-300 rounded px-4 py-2 focus:ring-green-500"
      >
        <option value="" disabled>
          Select your style
        </option>
        {styles.map((style) => (
          <option key={style} value={style}>
            {style}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CookingStyleDropdown;
