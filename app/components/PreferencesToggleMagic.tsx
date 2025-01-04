'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion'; // Install framer-motion if not already installed
import { WheatOff, Wheat } from 'lucide-react';

const PreferencesToggleMagic: React.FC = () => {
  const [isToggled, setIsToggled] = useState(false);

  const handleToggle = () => {
    setIsToggled(!isToggled);
  };

  return (
    <motion.div
      className="relative flex flex-col items-center justify-center space-y-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Glowing Toggle Button */}
      <motion.button
        onClick={handleToggle}
        className={`relative w-12 h-12 flex items-center justify-center rounded-full ${
          isToggled ? 'bg-[#27ff52] border border-sky-50 text-black' : 'border border-gray-500 bg-slate-950/30 text-gray-500'
        } shadow-lg`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        {isToggled ? (
          <WheatOff strokeWidth={1.5} className="h-6 w-6" />
        ) : (
          <Wheat strokeWidth={1.5} className="h-6 w-6" />
        )}

        {/* Sparkle Effect */}
        {isToggled && (
          <motion.div
            className="absolute top-0 left-0 w-full h-full rounded-full bg-green-400/30"
            animate={{ scale: [1, 1.5, 2], opacity: [1, 0.6, 0] }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.2 }}
          />
        )}
      </motion.button>

      {/* Magic Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isToggled ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="text-sm text-gray-300 font-light"
      >
        {isToggled ? 'Ahh yeahh, Magic Activated & Preferences Applied!' : 'Tap to Activate Magic'}
      </motion.div>
    </motion.div>
  );
};

export default PreferencesToggleMagic;
