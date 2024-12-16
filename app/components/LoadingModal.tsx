'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PuffLoader } from 'react-spinners';
import Image from 'next/image';
import { CheckCircle } from 'lucide-react'; // Importing the CircleCheck icon

interface LoadingModalProps {
  isOpen: boolean;
}

const LoadingModal: React.FC<LoadingModalProps> = ({ isOpen }) => {
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [receivedMessages, setReceivedMessages] = useState<string[]>([]);

  // Rotating loading messages
  const loadingMessages = [
    "Thinking...",
    "Gathering ingredients...",
    "Blending ideas...",
    "Whisking up thoughts...",
    "Cooking up something special...",
    "Simmering recipe view...",
    "Baking up shopping lists...",
    "Finalizing details...",
    "Just a moment...",
  ];;

  // Static recipe received messages
  const recipeReceivedMessages = [
    "First recipe whisked together...",
    "Next recipe whipped up...",
    "Last recipe ready to go!",
  ];

  // Clear received messages when modal opens
  useEffect(() => {
    if (isOpen) {
      setReceivedMessages([]); // Reset the message list
    }
  }, [isOpen]);

  // Cycle through loading messages every 2.5 seconds
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isOpen) {
      interval = setInterval(() => {
        setLoadingMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
      }, 2500);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOpen]);

  // Add recipe received messages every 5 seconds
  useEffect(() => {
    if (!isOpen) return;

    const recipeInterval = setInterval(() => {
      const nextIndex = receivedMessages.length;
      if (nextIndex < recipeReceivedMessages.length) {
        setReceivedMessages((prevMessages) => [...prevMessages, recipeReceivedMessages[nextIndex]]);
      }
    }, 5000);

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
              src="/images/kAi.png"
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
            <motion.div
              key={index}
              className="p-4 mx-4 bg-gray-700/80 backdrop-blur-lg shadow-lg rounded-r-3xl rounded-b-3xl text-white border border-gray-400 flex items-center space-x-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {/* CircleCheck Icon */}
              <CheckCircle size={20} color="#27ff52" />
              <span>{message}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoadingModal;
