'use client';

import React, { useEffect } from 'react';
import { CircleX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'; // Add this for animations!

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  imageSrc?: string; // Optional image for the modal
  buttonText?: string; // Optional button text
}

const GetStartedModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  content,
  imageSrc,
  buttonText = 'Got it!',
}) => {
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
          className="bg-white/90 backdrop-blur-lg border border-slate-200 shadow-lg rounded-2xl w-[90%] max-w-lg p-6 relative"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          role="dialog"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-200 hover:bg-slate-300 transition"
            aria-label="Close modal"
          >
            <CircleX className="w-5 h-5 text-slate-700" />
          </button>

          {/* Image */}
          {imageSrc && (
            <img
              src={imageSrc}
              alt={title}
              className="w-full h-40 object-contain rounded-lg mb-4"
            />
          )}

          {/* Title */}
          <h2
            id="modal-title"
            className="text-2xl font-bold text-slate-900 text-center mb-4"
          >
            {title}
          </h2>

          {/* Content */}
          <p
            id="modal-description"
            className="text-base text-slate-700 text-center mb-6"
          >
            {content}
          </p>

          {/* Action Button */}
          <button
            onClick={onClose}
            className="w-full py-3 rounded-full bg-pink-800 text-white font-semibold hover:bg-pink-700 transition"
          >
            {buttonText}
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GetStartedModal;
