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
        setMessage(`Thank you, subscription verified for ${data.email}, and welcome to Dishcovery!`);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, []);

  return (
    
    <div className="flex flex-col items-center justify-center min-h-screen"
        style={{ backgroundImage: "url('/images/soup-4.png')" }}
         >
     <div className="bg-white/30 backdrop-blur-lg border-white border shadow-lg ring-1 ring-black/5 mb-6 mt-2 p-6 rounded-2xl">
      {error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <>
          <p className="p-6 text-slate-950">{message}</p>
          <p className="p-6 text-slate-950">Choose your device to continue to install the app:</p>
          <div className="space-x-4">
            <a
              href="/dishcovery-test-ios_new.html"
              className="px-4 py-2 bg-[#00a39e] text-white rounded-full"
            >
              Apple iOS
            </a>
            <a
              href="/dishcovery-test_new.html"
              className="px-4 py-2 bg-[#00a39e] text-white rounded-full"
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
