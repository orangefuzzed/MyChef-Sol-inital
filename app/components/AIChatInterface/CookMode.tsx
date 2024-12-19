import React, { useEffect, useState } from 'react';

interface CookModeProps {
  cookModeData: string[]; // Array of instructions
  recipeTitle: string;    // The recipe title
}

const CookMode: React.FC<CookModeProps> = ({ cookModeData, recipeTitle }) => {
  const [wakeLock, setWakeLock] = useState<null | WakeLockSentinel>(null);
  const [error, setError] = useState<string | null>(null);
  const [isIos, setIsIos] = useState(false);
  const [isToastVisible, setIsToastVisible] = useState(false);

 // Detect iOS platform
 useEffect(() => {
  if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    setIsIos(true);
  }
}, []);

// Auto-hide toast after a few seconds
useEffect(() => {
  if (isToastVisible) {
    const timeout = setTimeout(() => {
      setIsToastVisible(false);
    }, 8000); // 8 seconds visibility
    return () => clearTimeout(timeout);
  }
}, [isToastVisible]);

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
        console.warn('Wake Lock API not supported.');
      }
    } catch (err) {
      console.error('Failed to activate wake lock:', err);
      setError('Failed to keep screen awake.');
    }
  };
  

  const releaseWakeLock = () => {
    if (wakeLock) {
      wakeLock.release();
      setWakeLock(null);
      console.log('Wake Lock released.');
    }
  };

  useEffect(() => {
    requestWakeLock();
    return () => releaseWakeLock();
  }, []);

  return (
    <div className="cook-mode bg-white/30 backdrop-blur-lg border-white border shadow-lg ring-1 ring-black/5 p-6 rounded-2xl">
      <h2 className="text-2xl font-medium text-sky-50 text-center">
        Let&apos;s Cook Your {recipeTitle}!
      </h2>
            {/* iOS Toast Notification */}
            {isIos && isToastVisible && (
        <div
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-pink-800/90 text-white rounded-lg shadow-md ring-1 ring-black/10 animate-fade-in-out"
          role="alert"
        >
          🍎 Heads up! iOS PWAs cannot prevent screen dimming or locking. For best results, adjust your screen timeout in settings or tap the screen occasionally.
        </div>
      )}
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
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
