import React, { useEffect, useState } from 'react';

interface CookModeProps {
  cookModeData: string[]; // Array of instructions
  recipeTitle: string;    // The recipe title
}

const CookMode: React.FC<CookModeProps> = ({ cookModeData }) => {
  const [wakeLock, setWakeLock] = useState<null | WakeLockSentinel>(null);
  const [error, setError] = useState<string | null>(null);
  const [isToastVisible, setIsToastVisible] = useState(false); // Toast visibility state

  // Periodically show the toast to prevent screen dimming
  useEffect(() => {
    const toastInterval = setInterval(() => {
      setIsToastVisible(true); // Show toast
      setTimeout(() => setIsToastVisible(false), 3000); // Hide after 3 seconds
    }, 25000); // Trigger every 25 seconds

    return () => clearInterval(toastInterval); // Cleanup on unmount
  }, []);

  // Request Wake Lock (if supported)
  const requestWakeLock = async () => {
    try {
      if ('wakeLock' in navigator) {
        const lock = await navigator.wakeLock.request('screen');
        setWakeLock(lock);
        console.log('Wake Lock is active');

        lock.addEventListener('release', () => {
          console.log('Wake Lock was released');
          setWakeLock(null);
        });
      } else {
        console.warn('Wake Lock API not supported in this browser.');
      }
    } catch (err) {
      console.error('Failed to activate wake lock:', err);
      setError('Failed to keep screen awake.');
    }
  };

  // Release Wake Lock
  const releaseWakeLock = () => {
    if (wakeLock) {
      wakeLock.release();
      setWakeLock(null);
      console.log('Wake Lock released.');
    }
  };

  // Initialize Wake Lock and set up cleanup
  useEffect(() => {
    requestWakeLock();
    return () => releaseWakeLock();
  }, []);

  return (
    <div className="cook-mode bg-white/30 backdrop-blur-lg border-white border shadow-lg ring-1 ring-black/5 p-6 rounded-2xl">
      {/* Page Title */}
      <h2 className="text-2xl font-medium text-sky-50 text-center">
        Let&apos;s Get Cooking!
      </h2>

      {/* Error Message */}
      {error && (
        <p className="text-red-500 text-center mt-4">{error}</p>
      )}

      {/* Toast Notification */}
      {isToastVisible && (
        <div
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-pink-800/90 text-white rounded-lg shadow-md ring-1 ring-black/10 animate-fade-in-out"
          role="status"
        >
          🍳 This keeps your recipe view alive!
        </div>
      )}

      {/* Instructions Header */}
      <div className="py-3 flex items-center text-sm text-black before:flex-1 before:border-t before:border-pink-800 before:me-6 after:flex-1 after:border-t after:border-pink-800 after:ms-6 dark:text-white dark:before:border-neutral-600 dark:after:border-neutral-600">
        INSTRUCTIONS
      </div>

      {/* Instructions List */}
      <ol className="list-decimal pl-6 text-base text-white text-lg leading-relaxed space-y-4">
        {cookModeData.map((step, index) => (
          <li key={index} className="mb-2">
            {step}
          </li>
        ))}
      </ol>
    </div>
  );
};

export default CookMode;
