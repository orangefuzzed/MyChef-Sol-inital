import React, { useEffect } from 'react';
import ReactDOM from 'react-dom'; // Import ReactDOM for portal
import { motion } from 'framer-motion'; // For animations

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const toastContent = (
    <motion.div
      initial={{ opacity: 0, translateY: 30 }}
      animate={{ opacity: 1, translateY: 0 }}
      exit={{ opacity: 0, translateY: 30 }}
      className={`fixed z-50 flex items-center justify-center p-4 backdrop-blur-lg w-80 ml-40 shadow-lg ring-1 ring-black/5 rounded-2xl text-white ${
        type === 'success'
          ? 'bg-[#59ED8F]/85 border border-[#27ff52]'
          : 'bg-pink-800/85 border border-pink-500'
      }`}
      style={{
        bottom: '50px', // Placement from the bottom
        left: '0%', // Center horizontally
        
      }}
    >
      <div className="flex items-center gap-3">
        {type === 'success' ? (
          <svg className="w-6 h-6 text-emerald-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
        <span className="text-lg font-medium">{message}</span>
      </div>
      <button
        onClick={onClose}
        className="absolute top-2 right-2 p-1 rounded-full bg-[#00a39e] hover:bg-white/40 transition"
        aria-label="Close Toast"
      >
        <svg className="w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </motion.div>
  );

  // Render the toast in a portal (outside the container hierarchy)
  return ReactDOM.createPortal(toastContent, document.body);
};

export default Toast;
