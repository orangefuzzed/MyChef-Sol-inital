'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ForgotPasswordModal from '../components/ForgotPasswordModal'; // Fixed import
import Image from "next/image";

export default function LoginPage() {
  const [step, setStep] = useState<'emailEntry' | 'login' | 'createPassword' | 'error' | 'none'>('emailEntry');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [hasActiveSub, setHasActiveSub] = useState(false);
  const [hasCreatedAcc, setHasCreatedAcc] = useState(false);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false); // ✅ FIXED

  const router = useRouter();

  const handleCheckEmail = async () => {
    setError('');
    if (!email) return;

    try {
      const res = await fetch(`/api/user/checkEmail?email=${encodeURIComponent(email)}`);
      if (!res.ok) throw new Error(`API error: ${res.status}`);

      const data = await res.json();

      if (!data.hasActiveSubscription) {
        setError(`No active subscription found for ${email}.`);
        setStep('error');
        return;
      }

      setHasActiveSub(true);
      setHasCreatedAcc(data.hasCreatedAccount);
      setStep(data.hasCreatedAccount ? 'login' : 'createPassword');
    } catch (err) {
      setError((err as Error).message);
      setStep('error');
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      const result = await signIn('credentials', { redirect: false, email, password });
      if (result?.error) {
        setError('Invalid email or password. Please try again.');
      } else {
        router.push('/');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again later.');
    }
  };

  const handleCreatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to create account');
      }

      const signInRes = await signIn('credentials', { redirect: false, email, password });
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
        <div className="bg-black w-10 h-10 border border-white rounded-full flex items-center justify-center">
          <Image
            src="/images/kAi.png"
            alt="kai"
            width={28}
            height={28}
          />
        </div>
        {step === 'emailEntry' && (
          <>
            <h2 className="text-xl font-semibold mt-4 mb-4 text-slate-950 text-center">Enter Your Payment Email</h2>
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
              className="w-full py-2 bg-[#00a39e] border border-solid border-[#00f5d0] text-sky-50 rounded-full"
            >
              Next
            </button>
          </>
        )}

        {step === 'login' && (
          <form onSubmit={handleLogin}>
            <h2 className="text-xl font-semibold mb-4 text-slate-950 text-center">Login</h2>
            <p className="text-sm text-gray-700 mb-2">Email: {email}</p>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-3 py-2 border border-gray-300 rounded mb-4 text-black"
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <button type="submit" className="w-full py-2 bg-[#00a39e] border border-solid border-[#00f5d0] text-sky-50 rounded-full">
              Log In
            </button>
            <p
              className="text-sm text-pink-800 cursor-pointer underline mt-2 text-center"
              onClick={() => setShowForgotPasswordModal(true)}
            >
              Forgot Password?
            </p>
          </form>
        )}

        {step === 'createPassword' && (
          <form onSubmit={handleCreatePassword}>
            <h2 className="text-xl font-semibold mb-4 text-center">Create Your Account</h2>
            <p className="text-sm text-gray-700 mb-2">Email: {email}</p>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create Password"
                className="w-full px-3 py-2 border border-gray-300 rounded mb-4 text-black"
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* ✅ Fixed Modal Display Logic */}
      {showForgotPasswordModal && <ForgotPasswordModal onClose={() => setShowForgotPasswordModal(false)} />}
    </div>
  );
}
