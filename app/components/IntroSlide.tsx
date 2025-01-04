'use client';

import React from 'react';
import PreferencesToggleMagic from './PreferencesToggleMagic';

interface IntroSlideProps {
  onNext: () => void; // Handler to proceed to the next slide
}

const IntroSlide: React.FC<IntroSlideProps> = ({ onNext }) => {
  return (
    <div className="p-6 space-y-4 text-center">
      {/* Header */}
      <h2 className="text-xl font-light text-[#00a39e]">
        Welcome to Dishcovery Preferences!
      </h2>

      {/* Blurb */}
      <p className="text-gray-300">
        Personalize your experience with preferences tailored just for you.
        All preferences selections are optional, and you can change and update them anytime by selecting "My Preferences" from the menu.
      </p>

      {/* Toggle Mention */}
      <p className="text-sm text-gray-400">
        Don’t forget to enable your preferences using the{" "}
        <span className="text-[#27ff52] font-semibold">Preferences Toggle</span>{" "}
        in the chat interface! Go ahead, give it a test! Tap to Activate Magic!
      </p>

      {/* Image or Animation Placeholder */}
      <div className="flex justify-center">
        <PreferencesToggleMagic />
        {/* Alternatively: Replace with a screenshot */}
      </div>

      {/* CTA Button */}
      <div className="text-center text-lg font-base text-[#00a39e] mt-2">
          Let’s Get Started!⟶
      </div>
    </div>
  );
};

export default IntroSlide;
