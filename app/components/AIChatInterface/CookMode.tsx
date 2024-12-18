import React, { useEffect, useState } from 'react';
import { TabletSmartphone } from 'lucide-react';

interface CookModeProps {
  cookModeData: string[]; // Array of instructions
  recipeTitle: string;    // The recipe title
}

const CookMode: React.FC<CookModeProps> = ({ cookModeData }) => {
  const [wakeLock, setWakeLock] = useState<null | WakeLockSentinel>(null);
  const [error, setError] = useState<string | null>(null);
  const [screenActive, setScreenActive] = useState(false);

  // Periodic "Soft Refresh"
  useEffect(() => {
    const softRefresh = setInterval(() => {
      window.scrollTo(0, 10); // Scroll down by 10px
      setTimeout(() => {
        window.scrollTo(0, 0); // Scroll back up
      }, 100); // Allow time for the scroll event
      console.log('Soft refresh triggered to prevent screen dimming.');
    }, 25000); // Fire every 25 seconds

    return () => clearInterval(softRefresh); // Cleanup interval on component unmount
  }, []);

  const requestWakeLock = async () => {
    try {
      if ('wakeLock' in navigator) {
        const lock = await navigator.wakeLock.request('screen');
        setWakeLock(lock);
        setScreenActive(true);
        console.log('Wake Lock is active');

        lock.addEventListener('release', () => {
          console.log('Wake Lock was released');
          setWakeLock(null);
          setScreenActive(false);
        });
      } else {
        console.warn('Wake Lock API not supported.');
      }
    } catch (err) {
      console.error('Failed to activate wake lock:', err);
      setError('Failed to keep screen awake.');
    }
  };

  useEffect(() => {
    requestWakeLock();
    return () => {
      if (wakeLock) {
        wakeLock.release();
        console.log('Wake Lock released.');
      }
    };
  }, []);

  return (
    <div className="cook-mode bg-white/30 backdrop-blur-lg border-white border shadow-lg ring-1 ring-black/5 p-6 rounded-2xl">
      <h2 className="text-2xl font-medium text-sky-50 text-center">
        Let&apos;s Get Cooking!
      </h2>
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      <button
        className="mt-4 p-2 px-6 bg-pink-800/50 border border-sky-50 shadow-lg ring-1 ring-black/5 rounded-full text-sky-50 flex items-center justify-center mx-auto gap-2"
        onClick={requestWakeLock}
      >
        {screenActive ? 'Screen is Active' : 'Click to Keep Screen Active'}
        <TabletSmartphone className="w-4 h-4" />
      </button>
      <div className="py-3 flex items-center text-sm text-black before:flex-1 before:border-t before:border-pink-800 before:me-6 after:flex-1 after:border-t after:border-pink-800 after:ms-6 dark:text-white dark:before:border-neutral-600 dark:after:border-neutral-600">
        INSTRUCTIONS
      </div>
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
