'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import styles from './LoginScreen.module.css';
import { Button } from '@radix-ui/themes';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';

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
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.title}>Login to MyChef</h2>
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
        <p className={styles.orText}>or</p>
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
        </Button>
        <p className={styles.signupText}>
          Don&apos;t have an account?{' '}
          <Link href="/signup" className={styles.link}>
            Create One!
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginScreen;
