// app/success/page.tsx (if using Next.js App Router)

'use client';

import React, { useEffect, useState } from 'react';

export default function SuccessPage() {
    const [message, setMessage] = useState('Verifying subscription...');
    const [error, setError] = useState('');

    useEffect(() => {
        // 1. Get session_id from URL
        const params = new URLSearchParams(window.location.search);
        const sessionId = params.get('session_id');
        if (!sessionId) {
            setError('No session_id found.');
            return;
        }

        // 2. Call your API route to verify + update DB
        fetch(`/api/stripe/verify-session?session_id=${encodeURIComponent(sessionId)}`)
            .then(async (res) => {
                if (!res.ok) {
                    const data = await res.json().catch(() => ({}));
                    throw new Error(data.error || 'Failed to verify session');
                }
                return res.json();
            })
            .then((data) => {
                // data might be { success: true, email: "somebody@domain.com", ... }
                setMessage(`Success! Thank you, subscription verified for ${data.email}. Welcome to Dishcovery!`);
            })
            .catch((err) => {
                setError(err.message);
            });
    }, []);

    return (

        <div
            className="flex items-center justify-center h-screen bg-fixed bg-cover bg-center"
            style={{ backgroundImage: "url('/images/soup-4.png')" }}
        >
            <div className="
    bg-white/30 
    backdrop-blur-lg 
    border border-white 
    shadow-lg 
    ring-1 ring-black/5 
    m-6 p-6 
    rounded-2xl 
    flex flex-col 
    items-center 
    text-center 
    space-y-4
  ">
                {error ? (
                    <p className="text-red-600">{error}</p>
                ) : (
                    <>
                        <p className="text-sky-50">{message}</p>
                        <p className="text-sky-50">Choose your device to install the app:</p>
                        <div className="flex space-x-4">
                            <a
                                href="/dishcovery-test-ios_new.html"
                                className="px-4 py-2 bg-[#00a39e] border border-solid border-[#00f5d0] text-sky-50 rounded-full"
                            >
                                Apple iOS
                            </a>
                            <a
                                href="/dishcovery-test_new.html"
                                className="px-4 py-2 bg-[#00a39e] border border-solid border-[#00f5d0] text-sky-50 rounded-full"
                            >
                                Android
                            </a>
                        </div>
                    </>
                )}
            </div>
        </div>


    );
}
