'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CircleX, CircleArrowLeft, CircleArrowRight } from 'lucide-react';

interface Slide {
  header: string;
  body: string;
  imageSrc?: string;
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
          className="bg-slate-950/80 backdrop-blur-lg border border-gray-400 shadow-lg rounded-2xl w-[90%] max-w-lg p-6 relative"
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
            className="absolute top-2 right-2 rounded-full bg-pink-800 transition z-10"
            aria-label="Close onboarding modal"
          >
            <CircleX className="w-5 h-5 text-sky-50" />
          </button>

          {/* Slide Content */}
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center space-y-4" // Add flexbox for vertical alignment
          >
            {slides[currentSlide].imageSrc && (
                <img
                  src={slides[currentSlide].imageSrc}
                  alt={slides[currentSlide].header}
                  className="w-full h-60 object-cover rounded-lg mb-4"
                />
              )}
            <h2
              id="onboarding-header"
              className="text-lg font-semibold text-center text-sky-50 mb-4"
            >
              {slides[currentSlide].header}
            </h2>
            <p
              id="onboarding-body"
              className="text-sm text-center text-sky-50"
            >
              {slides[currentSlide].body}
            </p>
          </motion.div>

          {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
            {/* Back Button */}
            <button
                onClick={prevSlide}
                disabled={currentSlide === 0}
                className={`py-1 px-4 rounded-full flex items-center justify-center ${
                currentSlide === 0
                    ? 'bg-slate-950/20 text-sm font-light  text-gray-600 cursor-not-allowed'
                    : 'bg-slate-950/20 text-sm font-light text-[#00a39e] hover:bg-[#00a39e]/10 transition'
                }`}
            >
                <CircleArrowLeft
                className={`w-7 h-7 rounded-full ${
                    currentSlide === 0 ? 'text-gray-600' : 'text-[#27ff52]'
                }`}
                />
            </button>

            {/* Next Button */}
              <button
                  onClick={() => {
                      if (currentSlide === slides.length - 1) {
                          onComplete(); // Mark onboarding as complete
                          onSkip(); // Close the modal (or any logic you want here)
                      } else {
                          nextSlide(); // Proceed to the next slide
                      }
                  }}
                  disabled={currentSlide === slides.length - 1 && false} // Remove "disabled" for Finish
                  className={`py-1 px-4 rounded-full flex items-center justify-center ${
                      currentSlide === slides.length - 1
                          ? 'bg-[#00a39e]/50 border border-sky-50 text-sm font-base text-sky-50 hover:bg-[#008d84] transition' // Style for the Finish button
                          : 'bg-slate-950/20 text-sm font-light text-[#00a39e] hover:bg-[#00a39e]/10 transition'
                  }`}
              >
                  {currentSlide === slides.length - 1 ? (
                      'Finish'
                  ) : (
                      <CircleArrowRight
                          className={`w-7 h-7 rounded-full ${
                              currentSlide === slides.length - 1 ? 'text-gray-600' : 'text-[#27ff52]'
                          }`}
                      />
                  )}
              </button>
            </div>

          {/* Progress Indicators */}
          <div className="flex justify-center mt-2" aria-label="Slide progress">
            {slides.map((_, index) => (
              <span
                key={index}
                className={`h-2 w-2 rounded-full mx-1 ${
                  index === currentSlide ? 'bg-[#27ff52]' : 'bg-gray-300'
                }`}
              ></span>
            ))}
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
