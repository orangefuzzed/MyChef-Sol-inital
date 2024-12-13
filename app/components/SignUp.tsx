'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './LoginScreen.module.css'; // Reuse the styles from the login page

const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

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
        setSuccessMessage('Account created successfully! Redirecting to login...');
        setEmail('');
        setPassword('');
        setTimeout(() => {
          router.push('/login');
        }, 2000); // Wait for 2 seconds before redirecting
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
    <div
      className={`${styles.container} flex items-center justify-center h-screen bg-fixed bg-cover`}
      style={{ backgroundImage: "url('/images/breakfast-2.png')" }}
    >
      <form onSubmit={handleSubmit} className="bg-white/30 backdrop-blur-lg border-white border shadow-lg ring-1 ring-black/5 p-6 m-4 rounded-2xl">
        {/* Logo */}
        <div className="flex items-center justify-center mb-2">
              <img src="/images/dishcovery-full-logo.png" alt="Dishcovery" className="w-3/4" />
            </div>
        <h2 className={styles.title}>Sign Up for Dishcovery</h2>
        {error && <p className={styles.error}>{error}</p>}
        {successMessage && <p className={styles.success}>{successMessage}</p>}
        <div className={styles.inputGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <button type="submit" className={styles.button} disabled={isLoading}>
          {isLoading ? 'Signing up...' : 'Sign Up'}
        </button>
        {/* Divider */}
        <div className="my-6 border-t border-pink-800"></div>
        <p className={styles.signupText}>
          Already have an account? <Link href="/login" className="text-md font-semibold text-[#00a39e]">Log In!</Link>
        </p>
      </form>
    </div>
  );
};

export default SignUp;