'use client';

import React, { useState } from 'react';
import Image from "next/image";


export default function ForgotPasswordModal({ onClose }: { onClose: () => void }) {
    const [email, setEmail] = useState('');
    const [passwordHint, setPasswordHint] = useState<string | null>(null);
    const [error, setError] = useState('');

    const handleFetchPasswordHint = async () => {
        setError('');
        setPasswordHint(null);

        try {
            const res = await fetch(`/api/user/password-hint?email=${encodeURIComponent(email)}`);
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Failed to retrieve password hint');

            setPasswordHint(data.passwordHint);
        } catch (err) {
            setError((err as Error).message);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="absolute top-20 bg-white/45 backdrop-blur-lg border border-white p-6 m-6 rounded-2xl shadow-md w-full max-w-md">
                <div className="bg-black w-10 h-10 border border-white rounded-full flex items-center justify-center">
                    <Image
                        src="/images/kAi.png"
                        alt="kai"
                        width={28}
                        height={28}
                    />
                </div>
                <h2 className="text-xl font-semibold text-slate-950 mt-4 mb-4 text-center">Forgot Password</h2>
                <p className="text-sm text-gray-700 mb-2">For account security purposes, please re-enter your email to retrieve your password hint.</p>
                
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded mb-4 text-black"
                    placeholder="someone@example.com"
                />

                {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

                {passwordHint && (
                    <div className="bg-gray-100 p-4 rounded-md shadow text-center text-gray-900 border border-gray-300 mb-4">
                        <p className="font-semibold text-gray-800">Password Hint:</p>
                        <p className="text-gray-700 italic">"{passwordHint}"</p>
                    </div>
                )}

                <button 
                    onClick={handleFetchPasswordHint} 
                    className="w-full py-2 bg-[#00a39e] border border-solid border-[#00f5d0] text-white rounded-full mb-2"
                >
                    Get Password Hint
                </button>

                <button onClick={onClose} className="w-full text-pink-800 underline">
                    Close
                </button>
            </div>
        </div>
    );
}
