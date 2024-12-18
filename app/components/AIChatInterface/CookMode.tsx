import React, { useEffect, useState } from 'react';

interface CookModeProps {
  cookModeData: string[]; // Array of instructions
  recipeTitle: string;    // The recipe title
}

const CookMode: React.FC<CookModeProps> = ({ cookModeData }) => {
  const [wakeLock, setWakeLock] = useState<null | WakeLockSentinel>(null);
  const [error, setError] = useState<string | null>(null);
  const [isToastVisible, setIsToastVisible] = useState(false); // Toast visibility state
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null); // Reference to the video element
  const [sessionStarted, setSessionStarted] = useState(false); // Track if session has started

  const activateFullscreenHack = () => {
    const video = document.createElement('video');
    video.setAttribute('playsinline', 'true'); // Required for Safari
    video.setAttribute('muted', 'true'); // Silent
    video.setAttribute('loop', 'true'); // Loop continuously
    video.style.position = 'absolute';
    video.style.width = '1px';
    video.style.height = '1px';
    video.style.opacity = '0';
    video.src = '/videos/tiny-video.mp4'; // Replace with your hosted silent video file

    document.body.appendChild(video); // Add video to DOM
    video.play()
      .then(() => {
        console.log('Fullscreen hack video is now playing.');
        setVideoRef(video); // Save reference for stopping later
      })
      .catch((err) => {
        console.error('Fullscreen hack failed to play:', err);
      });
  };

  const deactivateFullscreenHack = () => {
    if (videoRef) {
      videoRef.pause(); // Stop playback
      videoRef.remove(); // Remove from DOM
      setVideoRef(null); // Clear reference
      console.log('Fullscreen hack video stopped.');
    }
  };

  // Periodically show the toast and activate the fullscreen hack
  useEffect(() => {
    if (!sessionStarted) return; // Only activate after session has started

    const toastInterval = setInterval(() => {
      setIsToastVisible(true);
      activateFullscreenHack(); // Trigger the fullscreen hack with the toast
      setTimeout(() => {
        setIsToastVisible(false);
        deactivateFullscreenHack(); // Clean up after the toast disappears
      }, 3000); // Toast visible for 3 seconds
    }, 25000); // Trigger every 25 seconds

    return () => {
      clearInterval(toastInterval); // Cleanup on unmount
      deactivateFullscreenHack(); // Stop video playback
    };
  }, [sessionStarted, videoRef]);

  const handleStartSession = () => {
    setSessionStarted(true);
    console.log('Cooking session started!');
  };

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
        console.warn('Wake Lock API not supported. Activating fullscreen hack.');
        activateFullscreenHack();
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
        Let&apos;s Get Cooking!
      </h2>
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}

      {/* Start Session Button */}
      {!sessionStarted && (
        <button
          className="mt-4 p-2 px-6 bg-pink-800/50 border border-sky-50 shadow-lg ring-1 ring-black/5 rounded-full text-sky-50 flex items-center justify-center mx-auto gap-2"
          onClick={handleStartSession}
        >
          Start Cooking Session
        </button>
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
