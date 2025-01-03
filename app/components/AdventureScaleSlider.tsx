'use client';

import React from 'react';
import * as Slider from '@radix-ui/react-slider';

const AdventureScaleSlider = ({ value, onChange }: { value: number; onChange: (val: number) => void }) => {
  return (
    <div className="flex flex-col items-center p-6">
      <p className="text-lg font-semibold text-gray-200 mb-4">Adventure Scale</p>
      <Slider.Root
        className="relative flex items-center w-full max-w-sm h-5"
        value={[value]}
        onValueChange={(newValue) => onChange(newValue[0])}
        min={0}
        max={4}
        step={1}
      >
        <Slider.Track className="relative bg-gray-600 rounded-full h-2 w-full">
          <Slider.Range className="absolute bg-green-400 rounded-full h-full" />
        </Slider.Track>
        <Slider.Thumb
          className="block w-5 h-5 bg-green-400 rounded-full shadow-md focus:outline-none"
        />
      </Slider.Root>
      <div className="mt-4 text-sm text-gray-300">
        {['Safe & Familiar', 'Slightly Adventurous', 'Balanced Adventure', 'Adventurous', 'Wild & Bold'][value]}
      </div>
    </div>
  );
};

export default AdventureScaleSlider;
