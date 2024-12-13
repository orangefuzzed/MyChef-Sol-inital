'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
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
    <div
      className={`${styles.container} flex items-center justify-center h-screen bg-fixed bg-cover`}
      style={{ backgroundImage: "url('/images/breakfast-2.png')" }}
    >
      <form onSubmit={handleSubmit} className="bg-white/30 backdrop-blur-lg border-white border shadow-lg ring-1 ring-black/5 p-6 m-4 rounded-2xl">
        {/* Logo */}
        <div className="flex items-center justify-center mb-2">
              <img src="/images/dishcovery-full-logo.png" alt="Dishcovery" className="w-3/4" />
            </div>
        <h2 className={styles.title}>Login</h2>
        {error && <p className={styles.error}>{error}</p>}
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
          {isLoading ? 'Logging in...' : 'Log in'}
        </button>
        {/*<p className={styles.orText}>or</p>
        <Button
          variant="solid"
          color="gray"
          className={styles.oauthButton}
          onClick={() => handleOAuthLogin('google')}
        >
          <FcGoogle size={20} /> Log in with Google
        </Button>
        <Button
          variant="solid"
          color="blue"
          className={styles.oauthButton}
          onClick={() => handleOAuthLogin('facebook')}
        >
          <FaFacebook size={20} /> Log in with Facebook
        </Button>*/}
        {/* Divider */}
        <div className="my-6 border-t border-pink-800"></div>
        <p className={styles.signupText}>
          No Account yet?{' '}
          <Link href="/signup" className="text-md font-semibold text-[#00a39e]">
            Create One Now!
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginScreen;
