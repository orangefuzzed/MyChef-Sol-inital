'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import { Button } from '@radix-ui/themes';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import styles from './LoginScreen.module.css';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError('Invalid email or password. Please try again.');
      } else {
        // Redirect to home page or dashboard
        window.location.href = '/';
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: string) => {
    setIsLoading(true);
    await signIn(provider, { callbackUrl: '/' });
    setIsLoading(false);
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
                <h2 className="text-lg font-semibold text-center">Login</h2>
              </div>
            <div className="my-6 border-t border-pink-800"></div>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <div className="mb-4">
        <label htmlFor="email" className="block text-white text-sm mb-1">Email</label>
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
        
        {isLoading ? 'Logging in...' : 'Log In'}
        </button>
        <p className={styles.orText}>or</p>
        <Button
          variant="solid"
          color="gray"
          className={styles.oauthButton}
          onClick={() => handleOAuthLogin('google')}
        >
          <FcGoogle size={20} className='mr-2' />Log in with Google
        </Button>
        <Button
          variant="solid"
          color="blue"
          className={styles.oauthButton}
          onClick={() => handleOAuthLogin('facebook')}
        >
          <FaFacebook size={20} className='mr-2'/>Log in with Facebook
        </Button>
      
    </form>
  );
};

export default LoginScreen;

