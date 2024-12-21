import React, { useEffect } from 'react';
import { motion } from 'framer-motion'; // Optional for cool animations

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
  duration?: number; // Optional timeout duration in milliseconds
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    // Cleanup the timer when the component unmounts
    return () => clearTimeout(timer);
  }, [onClose, duration]);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className={`fixed z-50 flex items-center justify-center w-[90%] max-w-md p-4 backdrop-blur-lg shadow-lg ring-1 ring-black/5 p-6 rounded-2xl text-white ${
        type === 'success'
          ? 'bg-[#59ED8F]/85 border border-[#27ff52]' // Success Style
          : 'bg-pink-800/85 border border-pink-500' // Error Style
      }`}
      style={{
        top: '35%',
        left: '5%',
        transform: 'translate(-50%, -50%)', // Centering
      }}
    >
      <div className="flex items-center gap-3">
        {/* Icon */}
        {type === 'success' ? (
          <svg
            className="w-6 h-6 text-emerald-800"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        ) : (
          <svg
            className="w-6 h-6 text-red-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        )}

        {/* Message */}
        <span className="text-lg font-medium">{message}</span>
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 p-1 rounded-full bg-[#00a39e] hover:bg-white/40 transition"
        aria-label="Close Toast"
      >
        <svg
          className="w-4 h-4 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </motion.div>
  );
};

export default Toast;
