'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface SignUpProps {
  closeModal: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ closeModal }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        setSuccessMessage('Account created successfully!');
        setEmail('');
        setPassword('');
        setTimeout(() => {
          closeModal(); // Close the modal
        }, 2000);
      } else {
        const data = await response.json();
        setError(data.message || 'An unexpected error occurred. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/45 backdrop-blur-lg border border-white shadow-lg rounded-2xl p-6">
      <div className="flex items-center justify-center mb-4 space-x-2">
        <div className="bg-black w-10 h-10 border border-white rounded-full flex items-center justify-center">
          <Image
            src="/images/kAi.png"
            alt="kai"
            width={28}
            height={28}
          />
        </div>
        <h2 className="text-lg font-semibold text-center">Sign Up</h2>
      </div>
      <div className="my-6 border-t border-[#00f5d0]"></div>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {successMessage && <p className="p-4 mb-4 bg-[#00a39e] text-white rounded-full border-solid border border-[#00f5d0] text-center">{successMessage}</p>}
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm mb-1">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="password" className="block text-sm mb-1">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
        />
      </div>
      <button
        type="submit"
        className="w-full px-4 py-2 mt-2 bg-[#00a39e] border border-solid border-[#00f5d0] text-white rounded-full hover:bg-[#00f5d0] transition duration-200"
        disabled={isLoading}
      >
        {isLoading ? 'Signing up...' : 'Sign Up'}
      </button>
      <p className="text-sm font-light text-center mt-6">Dishcovery does not collect any data from our users. Ever.</p>
    </form>
  );
};

export default SignUp;
