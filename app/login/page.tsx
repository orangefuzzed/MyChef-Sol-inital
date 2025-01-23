'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [step, setStep] = useState<'emailEntry' | 'login' | 'createPassword' | 'error' | 'none'>('emailEntry');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [hasActiveSub, setHasActiveSub] = useState(false);
  const [hasCreatedAcc, setHasCreatedAcc] = useState(false);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const router = useRouter();

  // 1. User enters email, we check DB
  const handleCheckEmail = async () => {
    setError('');
    if (!email) return;

    try {
      const res = await fetch(`/api/user/checkEmail?email=${encodeURIComponent(email)}`);
      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }
      const data = await res.json();
      // data might look like:
      // { hasActiveSubscription: boolean, hasCreatedAccount: boolean }

      if (!data.hasActiveSubscription) {
        // Show error "no subscription for this email"
        setError(`No active subscription found for ${email}.`);
        setStep('error');
        return;
      }

      setHasActiveSub(true);
      setHasCreatedAcc(data.hasCreatedAccount);

      if (data.hasCreatedAccount === true) {
        // Show login form
        setStep('login');
      } else {
        // Show create password form
        setStep('createPassword');
      }

    } catch (err) {
      setError((err as Error).message);
      setStep('error');
    }
  };

  // 2. If user doc already exists => handle login
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      if (result?.error) {
        setError('Invalid email or password. Please try again.');
      } else {
        // If successful, go to homepage or wherever
        router.push('/');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again later.');
    }
  };

  // 3. If user doc does not exist => handle create password => create doc in DB
  const handleCreatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError('');

    try {
      // e.g. call /api/auth/register
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to create account');
      }

      // If success, auto-login or let user know
      // auto-login:
      const signInRes = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      if (signInRes?.error) {
        setError(`Account created, but login failed: ${signInRes.error}`);
      } else {
        router.push('/');
      }
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/images/breakfast-2.png')" }}>
      <div className="m-6 bg-white/45 backdrop-blur-lg border border-white shadow-lg rounded-2xl p-6 max-w-md w-full">
        {step === 'emailEntry' && (
          <>
            <h2 className="text-xl font-semibold mb-4 text-center">Enter Your Payment Email</h2>
            <p className="text-sm text-gray-700 mb-2">
              Please enter the same email you used for your subscription payment.
            </p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded mb-4 text-black"
              placeholder="someone@example.com"
            />
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <button
              onClick={handleCheckEmail}
              className="w-full py-2 bg-[#00a39e] text-white rounded hover:bg-[#00f5d0] transition"
            >
              Next
            </button>
          </>
        )}

        {step === 'login' && (
          <form onSubmit={handleLogin}>
            <h2 className="text-xl font-semibold mb-4 text-center">Login</h2>
            <p className="text-sm text-gray-700 mb-2">Email: {email}</p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-3 py-2 border border-gray-300 rounded mb-4 text-black"
            />
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <button
              type="submit"
              className="w-full py-2 bg-[#00a39e] text-white rounded hover:bg-[#00f5d0] transition"
            >
              Log In
            </button>
          </form>
        )}

        {step === 'createPassword' && (
          <form onSubmit={handleCreatePassword}>
            <h2 className="text-xl font-semibold mb-4 text-center">Create Your Account</h2>
            <p className="text-sm text-gray-700 mb-2">Email: {email}</p>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create Password"
              className="w-full px-3 py-2 border border-gray-300 rounded mb-4 text-black"
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              className="w-full px-3 py-2 border border-gray-300 rounded mb-4 text-black"
            />
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <button
              type="submit"
              className="w-full py-2 bg-[#00a39e] text-white rounded hover:bg-[#00f5d0] transition"
            >
              Create Account
            </button>
          </form>
        )}

        {step === 'error' && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-center">Error</h2>
            <p className="text-red-500 text-center">{error}</p>
            <button
              onClick={() => setStep('emailEntry')}
              className="mt-4 w-full py-2 bg-gray-400 text-white rounded"
            >
              Try again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
