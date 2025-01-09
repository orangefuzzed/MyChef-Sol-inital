'use client';

import React, { useEffect, useState } from 'react';
import { CircleX, CircleArrowRight, CircleArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeable } from 'react-swipeable'; // Import react-swipeable

interface CarouselSlide {
  title: string;
  description?: string;
  content: React.ReactNode; // Updated from 'string' to 'React.ReactNode'
  content2?: string; // This is fine as-is
  imageSrc?: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  slides: CarouselSlide[]; // Array of slides for the carousel
  currentSlideIndex: number; // Add this to control the slide index from the parent
  onNext: () => void; // Add this for next slide
  onPrev: () => void; // Add this for previous slide
}

const GetStartedModal: React.FC<ModalProps> = ({ isOpen, onClose, slides }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const handleNextSlide = () => {
    setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlideIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

    // Configure swipe gestures
    const swipeHandlers = useSwipeable({
      onSwipedLeft: handleNextSlide,
      onSwipedRight: handlePrevSlide,
      preventScrollOnSwipe: true,
      trackMouse: true, // Enable swipe gestures via mouse as well
    });

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
          {...swipeHandlers} // Attach swipe handlers here
          className="bg-slate-950/80 backdrop-blur-lg border border-gray-400 shadow-lg rounded-2xl w-[90%] max-w-lg p-6 relative"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          role="dialog"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 rounded-full bg-pink-800 transition z-10"
            aria-label="Close modal"
          >
            <CircleX className="w-5 h-5 text-sky-50" />
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
                  className="w-full h-60 object-cover rounded-lg mb-4"
                />
              )}
              <h2 className="text-lg font-semibold text-center text-sky-50 mb-4">
                {slides[currentSlideIndex].title}
              </h2>
              <p className="text-sm text-center mt-2 text-sky-50">
                {slides[currentSlideIndex].description}
              </p>
              <div className="text-sm text-center mt-2 text-sky-50">
                {slides[currentSlideIndex].content}
              </div>
              <p className="text-sm text-center mt-2 text-sky-50">
                {slides[currentSlideIndex].content2}
              </p>
            </motion.div>

            {/* Carousel Controls */}
            {/* Conditionally render controls and indicators */}
        {slides.length > 1 && (
          <>
            <div className="flex justify-between items-center mt-6 w-full px-8">
              <button
                onClick={handlePrevSlide}
                className="bg-slate-950/20 py-1 px-4 rounded-full text-sm font-light text-[#00a39e]"
              >
                <CircleArrowLeft className="w-5 h-5 text-[#27ff52]" />
              </button>
              <button
                onClick={handleNextSlide}
                className="bg-slate-950/20 py-1 px-4 rounded-full text-sm font-light text-[#00a39e]"
              >
                <CircleArrowRight className="w-5 h-5 text-[#27ff52]" />
              </button>
            </div>

            {/* Progress Dots */}
            <div className="flex gap-2 mt-4">
              {slides.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentSlideIndex
                      ? 'bg-[#27ff52]'
                      : 'bg-gray-400'
                  }`}
                ></div>
              ))}
            </div>
            </>
          )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GetStartedModal;
