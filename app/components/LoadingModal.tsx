'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PuffLoader } from 'react-spinners';
import Image from 'next/image';

interface LoadingModalProps {
  isOpen: boolean;
}

const LoadingModal: React.FC<LoadingModalProps> = ({ isOpen }) => {
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [receivedMessages, setReceivedMessages] = useState<string[]>([]);

  // Rotating loading messages
  const loadingMessages = [
    "Thinking...",
    "Cooking up something special...",
    "Whisking ideas...",
    "Simmering thoughts...",
    "Just a moment...",
  ];

  // Static recipe received messages
  const recipeReceivedMessages = [
    "First recipe whisked together...",
    "Second recipe whipped up...",
    "Third recipe baked to perfection!",
  ];

  // Cycle through loading messages every 3 seconds
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isOpen) {
      interval = setInterval(() => {
        setLoadingMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
      }, 3000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOpen]);

  // Add recipe received messages every 8 seconds
  useEffect(() => {
    if (!isOpen) return;

    const recipeInterval = setInterval(() => { // Changed 'let' to 'const'
      const nextIndex = receivedMessages.length;
      if (nextIndex < recipeReceivedMessages.length) {
        setReceivedMessages((prevMessages) => [...prevMessages, recipeReceivedMessages[nextIndex]]);
      }
    }, 8000);

    return () => clearInterval(recipeInterval);
  }, [isOpen, receivedMessages]);


  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center z-50 space-y-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Top Container: PuffLoader, Chef Whiskington, and Rotating Message */}
        <div className="flex flex-col items-center space-y-4">
          {/* Chef Whiskington Icon */}
          <div className="relative">
            <Image
              src="/images/food-bot-1.png"
              alt="Dishcovery Icon"
              width={60}
              height={60}
              className="absolute top-[10px] left-1/2 transform -translate-x-1/2 z-10"
            />
            <PuffLoader size={100} color="#27ff52" />
          </div>

          {/* Rotating Loading Text */}
          <p className="text-md text-white font-normal">{loadingMessages[loadingMessageIndex]}</p>
        </div>

        {/* Bottom Container: Recipe Received Messages */}
        <div className="w-full max-w-md space-y-2">
          {receivedMessages.map((message, index) => (
            <div
              key={index}
              className="p-4 mx-10 bg-gray-700/80 backdrop-blur-lg shadow-lg rounded-r-3xl rounded-b-3xl text-white border border-gray-400"
            >
              {message}
            </div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoadingModal;
