import React, { useEffect, useState } from 'react';
import TimerModal from '../../components/TimerModal'; // Import TimerModal
import Toast from '../../components/Toast';
import { Timer } from 'lucide-react';

interface CookModeProps {
  cookModeData: string[]; // Array of instructions
  recipeTitle: string;    // The recipe title
}

interface TimerData {
  step: string;
  duration: number; // Duration in minutes
}

const CookMode: React.FC<CookModeProps> = ({ cookModeData, recipeTitle }) => {
  const [wakeLock, setWakeLock] = useState<null | WakeLockSentinel>(null);
  const [error, setError] = useState<string | null>(null);
  const [timers, setTimers] = useState<TimerData[]>([]);
  const [activeTimer, setActiveTimer] = useState<TimerData | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Request wake lock to keep screen on
  const requestWakeLock = async () => {
    try {
      if ('wakeLock' in navigator) {
        const lock = await navigator.wakeLock.request('screen');
        setWakeLock(lock);

        lock.addEventListener('release', () => {
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
    }
  };

  useEffect(() => {
    requestWakeLock();
    return () => releaseWakeLock();
  }, []);

  // Utility to detect timers in instructions
  const detectTimers = (instructions: string[]): TimerData[] => {
    const timerRegex = /(\d+)\s?(minute|minutes|hour|hours)/i; // Match any "X minutes" or "X hours"
    return instructions
      .map((step) => {
        const match = step.match(timerRegex); // Match the time duration
        if (match) {
          const duration = parseInt(match[1], 10); // Extract the number
          const unit = match[2].toLowerCase(); // Get the unit (minutes/hours)

          // Convert hours to minutes for consistency
          const durationInMinutes = unit.startsWith('hour') ? duration * 60 : duration;

          return { step, duration: durationInMinutes }; // Always return duration in minutes
        }
        return null;
      })
      .filter(Boolean) as TimerData[];
  };

  // Initialize timers on component mount
  useEffect(() => {
    const extractedTimers = detectTimers(cookModeData);
    setTimers(extractedTimers);
  }, [cookModeData]);

  // Handle starting a timer
  const handleStartTimer = (timer: TimerData) => {
    setActiveTimer(timer);
    setTimeRemaining(timer.duration * 60); // Convert minutes to seconds
  };

  // Handle countdown logic
  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => (prev ? prev - 1 : null));
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemaining]);

  // Notify when timer ends
  useEffect(() => {
    if (timeRemaining === 0 && activeTimer) {
      const handleTimerEnd = async () => {
        // Play the "ding" sound
        const audio = new Audio('/audio/ding.mp3'); // Adjust the path to your sound file
        await audio.play().catch((err) =>
          console.error('Failed to play sound:', err)
        );

        // Show toast message
        setToastMessage(`Ding! ${activeTimer.step} is ready!`);

        // Add a short delay before closing the modal
        setTimeout(() => {
          setActiveTimer(null); // Close the modal
          setTimeRemaining(null); // Reset timeRemaining
        }, 1000); // Adjust delay as needed (1 second here)
      };

      handleTimerEnd();
    }
  }, [timeRemaining, activeTimer]);

  return (
    <div className="cook-mode bg-white/30 backdrop-blur-lg border-white border shadow-lg ring-1 ring-black/5 p-6 rounded-2xl">
      <h2 className="text-xl font-medium text-sky-50 text-center">
        Let&apos;s Cook Your {recipeTitle}!
      </h2>
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}

      <div className="py-3 flex items-center text-sm text-black before:flex-1 before:border-t before:border-pink-800 before:me-6 after:flex-1 after:border-t after:border-pink-800 after:ms-6 dark:text-white dark:before:border-neutral-600 dark:after:border-neutral-600">
        INSTRUCTIONS
      </div>

      <ol className="pl-2 text-base text-white text-lg space-y-4">
        {cookModeData.map((step, index) => {
          const timer = timers.find((t) => t.step === step);

          return (
            <li key={index} className="mb-2">
              <div className="flex items-center justify-between">
                {/* Add "Step X" with the number */}
                <span>
                  <span className="font-semibold text-sky-50 underline underline-offset-2">Step {index + 1}:</span> {step}
                </span>
                {timer && (
                  <button
                    onClick={() => handleStartTimer(timer)}
                    className="ml-1 bg-slate-950/80 rounded-full p-1 flex items-center justify-center border border-sky-50 text-pink-800 hover:text-pink-600"
                  >
                    <Timer strokeWidth={2} size={20} className="text-[#00f5d0]" />
                  </button>
                )}

              </div>
            </li>
          );
        })}
      </ol>

      {/* Timer Modal */}
      {activeTimer && (
        <TimerModal
          step={activeTimer.step} // This is now valid
          duration={activeTimer.duration}
          onClose={() => setActiveTimer(null)}
          isOpen={!!activeTimer}
          unit="minutes" // Pass the unit for duration
        />
      )}

      {/* Toast Notifications */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
};

export default CookMode;
