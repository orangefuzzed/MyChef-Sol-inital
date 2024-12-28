'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CircleX } from 'lucide-react';

interface Slide {
  header: string;
  body: string;
}

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  slides: Slide[];
  onSkip: () => void;
  onComplete: () => void; // New prop to handle completing onboarding
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  slides,
  onSkip,
  onComplete,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete(); // Call the complete onboarding action
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  useEffect(() => {
    if (!isOpen) setCurrentSlide(0); // Reset to the first slide when modal closes
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {/* Modal Background */}
      <motion.div
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        aria-live="polite"
      >
        {/* Modal Content */}
        <motion.div
          className="bg-white/90 backdrop-blur-lg border border-slate-200 shadow-lg rounded-2xl w-[90%] max-w-lg p-6 relative"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          role="dialog"
          aria-labelledby="onboarding-header"
          aria-describedby="onboarding-body"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-200 hover:bg-slate-300 transition z-10"
            aria-label="Close onboarding modal"
          >
            <CircleX className="w-5 h-5 text-slate-700" />
          </button>

          {/* Slide Content */}
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <h2
              id="onboarding-header"
              className="text-xl font-bold text-center text-pink-800 mb-4"
            >
              {slides[currentSlide].header}
            </h2>
            <p
              id="onboarding-body"
              className="text-sm text-center text-slate-600"
            >
              {slides[currentSlide].body}
            </p>
          </motion.div>

          {/* Progress Indicators */}
          <div className="flex justify-center mt-4" aria-label="Slide progress">
            {slides.map((_, index) => (
              <span
                key={index}
                className={`h-2 w-2 rounded-full mx-1 ${
                  index === currentSlide ? 'bg-pink-800' : 'bg-gray-300'
                }`}
              ></span>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className={`py-2 px-4 rounded ${
                currentSlide === 0
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  : 'bg-pink-800 text-white hover:bg-pink-700'
              }`}
            >
              Back
            </button>
            <button
              onClick={nextSlide}
              className="py-2 px-4 rounded bg-pink-800 text-white hover:bg-pink-700"
            >
              {currentSlide === slides.length - 1 ? 'Finish' : 'Next'}
            </button>
          </div>

          {/* Skip Button */}
          <div className="mt-4 text-center">
            <button
              onClick={() => {
                onSkip(); // Allow skipping
                onComplete(); // Still mark onboarding as complete
              }}
              className="text-sm text-gray-500 underline hover:text-gray-700"
            >
              Skip
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OnboardingModal;
