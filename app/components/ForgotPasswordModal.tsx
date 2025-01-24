'use client';

import React, { useState } from 'react';
import Image from "next/image";

export default function ForgotPasswordModal({ onClose }: { onClose: () => void }) {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async () => {
        setMessage('');
        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();
            setMessage(data.message);
        } catch (error) {
            setMessage("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white/45 backdrop-blur-lg border border-white p-6 m-6 rounded-lg shadow-md w-full max-w-md">
                <div className="bg-black w-10 h-10 border border-white rounded-full flex items-center justify-center">
                    <Image
                        src="/images/kAi.png"
                        alt="kai"
                        width={28}
                        height={28}
                    />
                </div>
                <h2 className="text-xl font-semibold text-slate-950 mt-4 mb-4">Reset Password</h2>
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
                {message && <p className="text-sm text-red-500">{message}</p>}
                <button onClick={handleSubmit} className="w-full py-2 bg-[#00a39e] border border-solid border-[#00f5d0] text-sky-50 rounded-full">
                    Send Reset Email
                </button>
                <button onClick={onClose} className="mt-4 w-full text-pink-800 underline">
                    Close
                </button>
            </div>
        </div>
    );
}
