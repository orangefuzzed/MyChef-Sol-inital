'use client';

import React, { useEffect, useState } from 'react';
import { CircleX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CarouselSlide {
  title: string;
  content: string;
  content2?: string; // Make this optional in case a slide doesn't have it
  imageSrc?: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  slides: CarouselSlide[]; // Array of slides for the carousel
}

const GetStartedModal: React.FC<ModalProps> = ({ isOpen, onClose, slides }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Handle Escape key to close the modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleNextSlide = () => {
    setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlideIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  return (
    <AnimatePresence>
      {/* Overlay */}
      <motion.div
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Modal */}
        <motion.div
          className="bg-white/90 backdrop-blur-lg border border-slate-200 shadow-lg rounded-2xl w-[90%] max-w-lg p-6 relative"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          role="dialog"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 z-10 rounded-full bg-slate-200 hover:bg-slate-300 transition"
            aria-label="Close modal"
          >
            <CircleX className="w-5 h-5 text-slate-700" />
          </button>

          {/* Carousel */}
          <div className="flex flex-col items-center">
            {/* Slide Content */}
            <motion.div
              key={currentSlideIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              {slides[currentSlideIndex].imageSrc && (
                <img
                  src={slides[currentSlideIndex].imageSrc}
                  alt={slides[currentSlideIndex].title}
                  className="w-full h-40 object-contain rounded-lg mb-4"
                />
              )}
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                {slides[currentSlideIndex].title}
              </h2>
              <p className="text-base text-slate-700">
                {slides[currentSlideIndex].content}
              </p>
              <p className="text-base text-slate-700">
                {slides[currentSlideIndex].content2}
              </p>
            </motion.div>

            {/* Carousel Controls */}
            <div className="flex justify-between items-center mt-4 w-full px-8">
              <button
                onClick={handlePrevSlide}
                className="text-pink-800 hover:text-pink-700 transition"
              >
                Previous
              </button>
              <button
                onClick={handleNextSlide}
                className="text-pink-800 hover:text-pink-700 transition"
              >
                Next
              </button>
            </div>

            {/* Progress Dots */}
            <div className="flex gap-2 mt-4">
              {slides.map((_, index) => (
                <div
                  key={index}
                  className={`w-2.5 h-2.5 rounded-full ${
                    index === currentSlideIndex
                      ? 'bg-pink-800'
                      : 'bg-gray-400'
                  }`}
                ></div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GetStartedModal;
