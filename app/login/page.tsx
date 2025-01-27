'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ForgotPasswordModal from '../components/ForgotPasswordModal'; // Fixed import
import Image from "next/image";

export default function LoginPage() {
  const [step, setStep] = useState<
    'emailEntry' | 'login' | 'createPassword' | 'error' | 'passwordReset' | 'none'>('emailEntry');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [hasActiveSub, setHasActiveSub] = useState(false);
  const [hasCreatedAcc, setHasCreatedAcc] = useState(false);
  const [hasCreatedPasswordHint, setHasCreatedPasswordHint] = useState(false);
  const [passwordReset, setpasswordReset] = useState(false);
  const [passwordHint, setPasswordHint] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false); // ✅ FIXED

  const router = useRouter();

  const fetchPasswordHintStatus = async () => {
    try {
      const res = await fetch(`/api/user/createdPasswordHint-status`);
      const data = await res.json();
      setHasCreatedPasswordHint(data.hasCreatedPasswordHint);
    } catch (err) {
      console.error('Error checking password hint status:', err);
    }
    fetchPasswordHintStatus();
  };

  const handleCheckEmail = async () => {
    setError('');
    if (!email) return;

    try {
      const res = await fetch(`/api/user/checkEmail?email=${encodeURIComponent(email)}`);
      if (!res.ok) throw new Error(`API error: ${res.status}`);

      const data = await res.json();
      // data = { hasActiveSubscription, docExists, hasCreatedAccount, passwordReset }

      if (!data.hasActiveSubscription) {
        setError(`No active subscription found for ${email}.`);
        setStep('error');
        return;
      }

      if (!data.docExists) {
        // brand new user => create
        setHasActiveSub(true);
        setHasCreatedAcc(false);
        setStep('createPassword');
        return;
      }

      // docExists => check if passwordReset
      if (data.passwordReset) {
        // forcibly reset
        setHasActiveSub(true);
        setHasCreatedAcc(false);
        setStep('passwordReset');
        return;
      }

      // else check hasCreatedAccount
      if (data.hasCreatedAccount) {
        setHasActiveSub(true);
        setHasCreatedAcc(true);
        setStep('login');
      } else {
        // docExists but hasCreatedAccount = false => brand new doc or forced scenario
        // if you want brand new doc => 'createPassword'
        setHasActiveSub(true);
        setHasCreatedAcc(false);
        setStep('createPassword');
      }
    } catch (err) {
      setError((err as Error).message);
      setStep('error');
    }
  };

  const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!passwordHint.trim()) {
      setError('A password hint is required.');
      return;
    }

    try {
      const res = await fetch('/api/user/passwordReset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword: password, passwordHint }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to reset password');
      }

      // Now user doc is updated => hasCreatedAccount = true => password updated
      // Auto login
      const signInRes = await signIn('credentials', { redirect: false, email, password });
      if (signInRes?.error) {
        setError(`Password reset, but login failed: ${signInRes.error}`);
      } else {
        router.push('/');
      }
    } catch (err) {
      setError((err as Error).message);
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
    setError('');

    if (!passwordHint.trim()) {
      setError('Password hint is required.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      // 1. Create the account via /api/auth/register
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, passwordHint }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to create account');
      }

      // 2. Mark password hint as created (if you still need this route)
      await fetch('/api/user/createdPasswordHint-status', { method: 'POST' });

      // 3. Mark hasCreatedAccount = true
      await fetch('/api/user/createdAccount-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hasCreatedAccount: true }),
      });

      // 4. Auto-login
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
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/images/breakfast-2.png')" }}
    >
      <div className="mx-6 mb-60 bg-white/45 backdrop-blur-lg border border-white shadow-lg rounded-2xl p-6 max-w-md w-full">
        <div className="bg-black w-10 h-10 border border-white rounded-full flex items-center justify-center">
          <Image src="/images/kAi.png" alt="kai" width={28} height={28} />
        </div>

        {step === 'emailEntry' && (
          <>
            <h2 className="text-xl font-semibold mt-4 mb-4 text-slate-950 text-center">
              Enter Your Payment Email
            </h2>
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

            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                className="w-full px-3 py-2 border border-gray-300 rounded mb-4 text-black"
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-600"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? '🙈' : '👁️'}
              </button>
            </div>
            <p className="text-sm text-gray-700 mb-2">Create a password hint - this is a REQUIRED field.</p>
            <input type="text"
              value={passwordHint}
              onChange={(e) => setPasswordHint(e.target.value)}
              placeholder="Enter a password hint (REQUIRED)" className="w-full px-3 py-2 border border-gray-300 rounded mb-4 text-black" required />
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <button type="submit" className="w-full py-2 bg-[#00a39e] border border-solid border-[#00f5d0] text-sky-50 rounded-full">
              Create Account
            </button>
          </form>
        )}

        {/* NEW: Step "error" */}
        {step === 'error' && (
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-4 text-rose-600 text-center">Error</h2>
            <p className="text-slate-950 mb-4">{error}</p>
            <button
              onClick={() => {
                setError('');
                setStep('emailEntry');
              }}
              className="w-full py-2 bg-[#00a39e] border border-solid border-[#00f5d0] text-sky-50 rounded-full"
            >
              Please Try Again
            </button>
          </div>
        )}

        {step === 'passwordReset' && (
          <form onSubmit={handlePasswordReset}>
            <h2 className="text-xl font-semibold mb-4 text-center">Reset Your Password</h2>
            <p className="text-sm text-gray-700 mb-2">Email: {email}</p>

            {/* New Password Field with Toggle */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New Password"
                className="w-full px-3 py-2 border border-gray-300 rounded mb-4 text-black"
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            {/* Confirm Password Field with Toggle */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                className="w-full px-3 py-2 border border-gray-300 rounded mb-4 text-black"
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-600"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? "🙈" : "👁️"}
              </button>
            </div>
            <p className="text-sm text-gray-700 mb-2">Create a password hint - this is a REQUIRED field.</p>
            <input type="text"
              value={passwordHint}
              onChange={(e) => setPasswordHint(e.target.value)}
              placeholder="Enter a password hint (REQUIRED)" className="w-full px-3 py-2 border border-gray-300 rounded mb-4 text-black" required />
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <button
              type="submit"
              className="w-full py-2 bg-[#00a39e] border border-solid border-[#00f5d0] text-sky-50 rounded-full"
            >
              Reset Password
            </button>
          </form>
        )}
      </div>
      {showForgotPasswordModal && (
        <ForgotPasswordModal onClose={() => setShowForgotPasswordModal(false)} />
      )}
    </div>
  );
}
