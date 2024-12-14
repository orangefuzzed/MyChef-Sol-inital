'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import LoginScreen from '../components/Login';
import SignUp from '../components/SignUp';

export default function LoginPage() {
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setSignUpModalOpen] = useState(false);

  const closeModals = () => {
    setLoginModalOpen(false);
    setSignUpModalOpen(false);
  };

  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  const closeModal = () => setIsSignUpOpen(false);

  return (
    <div
      className="flex items-center justify-center h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/images/breakfast-2.png')" }}
    >
      <div className="absolute top-20 bg-white/25 backdrop-blur-lg border border-sky-50 shadow-lg rounded-2xl mx-6 p-2">
      {/* Logo */}
      <div className="mt-4 text-center">
        <img
          src="/images/dishcovery-full-logo.png"
          alt="Dishcovery Logo"
          className="w-2/3 mx-auto"
        />
      </div>

      {/* Buttons */}
      <div className="flex flex-col items-center space-y-4 mb-4 mt-4">
        <button
          className="px-14 py-2 mt-2 bg-[#00a39e] border border-solid border-[#00f5d0] text-white rounded-full hover:bg-[#00f5d0] transition duration-200"
          onClick={() => setLoginModalOpen(true)}
        >
          Login
        </button>
        <button
          className="px-5 py-2 mt-2 bg-[#00a39e] border border-solid border-[#00f5d0] text-white rounded-full hover:bg-[#00f5d0] transition duration-200"
          onClick={() => setSignUpModalOpen(true)}
        >
          Create Account
        </button>
      </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isLoginModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="relative p-6 w-full max-w-md"
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              transition={{ duration: 0.3 }}
            >
              <LoginScreen />
              <button
                className="absolute top-8 right-10 text-white hover:text-red-500"
                onClick={closeModals}
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}

        {isSignUpModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="relative p-6 w-full max-w-md"
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              transition={{ duration: 0.3 }}
            >
              {/* Pass closeModal prop to SignUp */}
              <SignUp closeModal={closeModals} />
              <button
                className="absolute top-8 right-10 text-white hover:text-red-500"
                onClick={closeModals}
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
