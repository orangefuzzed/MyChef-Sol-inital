import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { RefreshCw } from 'lucide-react';

interface RetryModalProps {
  isOpen: boolean;
  onRetry: () => void; // Function to handle retry logic
  onClose: () => void; // Function to handle modal close
}

const RetryModal: React.FC<RetryModalProps> = ({ isOpen, onRetry, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center z-50 space-y-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose} // Close modal when clicking outside
      >
        {/* Modal Content */}
        <motion.div
          className="flex flex-col items-center space-y-4"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()} // Prevent clicks inside the modal from closing it
        >
          {/* Chef Whiskington Icon */}
          <div className="relative mb-4">
            <Image
              src="/images/food-bot-1.png"
              alt="Chef Whiskington"
              width={80}
              height={80}
              className="shadow-lg"
            />
          </div>

          {/* Retry Message */}
          <p className="mr-4 ml-4 text-white bg-slate-700/30 backdrop-blur-lg shadow-lg py-4 px-8 rounded-r-3xl rounded-b-3xl border-white border mb-2">
            Whoa, the kitchen’s a little chaotic right now! Let’s retry that request and get things back on track!
          </p>

          {/* Retry Button */}
          <button
          onClick={onRetry}
          className="p-2 px-4 bg-orange-500 text-white rounded-full flex items-center gap-2 hover:bg-orange-600 transition"
          >
            <RefreshCw className="w-5 h-5" />
            Retry my last request!
        </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RetryModal;
