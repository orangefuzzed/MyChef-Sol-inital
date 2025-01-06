import React, { useEffect } from 'react';
import ReactDOM from 'react-dom'; // Import ReactDOM for portal
import { motion } from 'framer-motion'; // For animations

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning';
  actions?: { label: string; action: () => void }[];
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type, actions, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const toastContent = (
    <motion.div
    initial={{ opacity: 0, translateY: 40 }}
    animate={{ opacity: 1, translateY: 0 }}
    exit={{ opacity: 0, translateY: 20 }}
    role="alert" // Accessibility
    className={`fixed z-50 flex items-center justify-center px-8 py-4 backdrop-blur-lg w-full max-w-2xl shadow-lg ring-1 ring-black/5 rounded-xl text-white ${
      type === 'success'
        ? 'bg-slate-950/55 border border-sky-50'
        : 'bg-slate-950/55 border border-sky-50'
    }`}
    style={{
      top: '50%', // Vertical center
      left: '0%', // Horizontal center
      transform: 'translate(-50%, -50%)', // Perfect centering
    }}
    
    >
      {/* Toast Content */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-3">
          {type === 'success' ? (
            <svg className="w-6 h-6 text-[#27ff52]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          <span className="text-sm font-normal mr-2">{message}</span>
        </div>

        {/* Action Buttons */}
        {actions && actions.length > 0 && (
          <div className="flex gap-4 mt-2">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="px-6 py-1 rounded-full bg-slate-950/30 text-white hover:bg-slate-950/50 transition"
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 p-1 rounded-full bg-slate-950/30 hover:bg-slate-950/50 transition"
        aria-label="Close Toast"
      >
        <svg className="w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </motion.div>
  );

  return ReactDOM.createPortal(toastContent, document.body);
};


export default Toast;
