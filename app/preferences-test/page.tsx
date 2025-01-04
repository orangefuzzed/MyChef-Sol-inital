'use client';

import React, { useState } from 'react';
import PreferencesFlow from './../components/PreferencesFlow';

const PreferencesTestPage = () => {
  const [isFlowOpen, setFlowOpen] = useState(true);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="text-center text-gray-200">
        <h1 className="text-2xl font-bold mb-4">Dishcovery Preferences Test 🧑‍🍳✨</h1>
        <p className="text-lg mb-8">
          Click below to launch the preferences flow and customize your Dishcovery experience!
        </p>
        <button
          className="px-8 py-2 bg-green-500 text-white rounded-full hover:bg-[#00a39e] transition"
          onClick={() => setFlowOpen(true)}
        >
          Launch Preferences Flow
        </button>
      </div>

      {isFlowOpen && (
        <PreferencesFlow
          isOpen={isFlowOpen}
          onClose={() => setFlowOpen(false)}
        />
      )}
    </div>
  );
};

export default PreferencesTestPage;
