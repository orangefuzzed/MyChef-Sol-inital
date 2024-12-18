import React, { useEffect, useState } from 'react';
import { TabletSmartphone } from 'lucide-react';


interface CookModeProps {
  cookModeData: string[]; // Array of instructions
  recipeTitle: string;    // The recipe title
}

const CookMode: React.FC<CookModeProps> = ({ cookModeData }) => {
  const [wakeLock, setWakeLock] = useState<null | WakeLockSentinel>(null);
  const [error, setError] = useState<string | null>(null);
  const [screenActive, setScreenActive] = useState(false); // Track if screen is actively locked

  const handleKeepScreenActive = async () => {
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
        console.warn('Wake Lock API not supported. Activating fullscreen hack.');
        activateFullscreenHack();
        setScreenActive(true);
      }
    } catch (err) {
      console.error('Failed to activate wake lock:', err);
      setError('Failed to keep screen awake.');
    }
  };

  const activateFullscreenHack = () => {
    const video = document.createElement('video');
    video.setAttribute('playsinline', 'true');
    video.setAttribute('muted', 'true');
    video.setAttribute('loop', 'true');
    video.style.position = 'absolute';
    video.style.width = '1px';
    video.style.height = '1px';
    video.style.opacity = '0'; // Make it fully invisible
    video.src =
      'data:video/mp4;base64,AAAAFGZ0eXBtcDQyAAAAAG1wNDEAAAAAaXNvbXNkYXQAAAAD//+EYXRvb2wwMDAwMDAwMAAAAABoZWxvb2woAAAAARp3cG9xU3lhbQAAAAATYXZjcDPEAAAAA3N0c29CVE9QAAAAAIA=';
    video.addEventListener('loadstart', () => {
      console.log('Fullscreen hack video has started loading.');
    });
    document.body.appendChild(video);
    video
      .play()
      .then(() => {
        console.log('Fullscreen hack video is playing.');
      })
      .catch((err) => {
        console.warn('Fullscreen hack failed to play:', err);
      });
  };
  

  // Request Wake Lock (for supported platforms)
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
        console.warn('Wake Lock API is not supported in this browser. Activating fullscreen hack.');
        activateFullscreenHack();
      }
    } catch (err) {
      console.error('Failed to acquire wake lock:', err);
      setError('Wake Lock failed to activate');
    }
  };

  // Release Wake Lock on cleanup
  const releaseWakeLock = () => {
    if (wakeLock) {
      wakeLock.release();
      setWakeLock(null);
      console.log('Wake Lock released');
    }
  };

  useEffect(() => {
    requestWakeLock();
    return () => releaseWakeLock();
  }, []);

  return (
    <div className="cook-mode bg-white/30 backdrop-blur-lg border-white border shadow-lg ring-1 ring-black/5 p-6 rounded-2xl">
      <h2 className="text-2xl font-medium text-sky-50 text-center">
        Let&apos;s Get Cooking!
      </h2>
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        <button
          className="mt-4 p-2 px-6 bg-pink-800/50 border border-sky-50 shadow-lg ring-1 ring-black/5 rounded-full text-sky-50 flex items-center justify-center mx-auto gap-2"
          onClick={handleKeepScreenActive}
          disabled={screenActive} // Disable button if already active
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
