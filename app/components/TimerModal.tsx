import React, { useState, useEffect } from 'react';

interface TimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  duration: number; // In seconds
  unit: string; // 'minutes' or 'seconds'
  step: string; // Add this to display the step in the modal
}

const TimerModal: React.FC<TimerModalProps> = ({ isOpen, onClose, duration, unit, step }) => {
  const [timeLeft, setTimeLeft] = useState(duration * (unit === 'minutes' ? 60 : 1));
  const [isRunning, setIsRunning] = useState(false);
  const [isTimerFinished, setIsTimerFinished] = useState(false); // Track timer completion

  // Explicitly define the timer type
  let timer: ReturnType<typeof setInterval> | null = null;

  // Play the "ding" sound when the timer finishes
  const playDing = () => {
    const audio = new Audio('/sounds/ding.mp3'); // Ensure this path is correct
    audio.play().catch((err) => console.error('Failed to play sound:', err));
  };

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }

    if (timeLeft === 0 && isRunning) {
      // Timer reached zero
      setIsTimerFinished(true); // Mark timer as finished
      playDing(); // Play the "ding" sound
      setIsRunning(false); // Stop the timer
      if (timer) clearInterval(timer); // Clear the interval
    }

    // Cleanup function to avoid memory leaks
    return () => {
      if (timer) {
        clearInterval(timer); // Properly type-safe clearing
        timer = null; // Reset the timer
      }
    };
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return isOpen ? (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-slate-950/65 border border-gray-500 p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Cooking Timer</h2>
        <h2 className="font-base text-lg mb-4">For Step: {step}</h2> {/* Display the step */}
        <p className="mt-2 text-xl font-bold text-sky-50 mb-6">{formatTime(timeLeft)}</p>

        <div className="flex justify-center gap-4">
          {/* Start/Pause Button */}
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="bg-[#00a39e]/65 border border-[#00a39e] text-sky-50 px-6 py-2 rounded-full"
          >
            {isRunning ? 'Pause' : 'Start'}
          </button>

          {/* Reset Button */}
          <button
            onClick={() => {
              setTimeLeft(duration * (unit === 'minutes' ? 60 : 1));
              setIsRunning(false);
              setIsTimerFinished(false); // Reset finished state
            }}
            className="bg-gray-600/65 border border-gray-500 text-sky-50 px-4 py-2 rounded-full"
          >
            Reset
          </button>

          {/* Close Button */}
          <button
            onClick={() => {
              setIsRunning(false); // Stop the timer
              setIsTimerFinished(false); // Reset finished state
              onClose(); // Trigger close
            }}
            className="bg-pink-800/65 border border-pink-800 text-sky-50 px-4 py-2 rounded-full"
          >
            Close
          </button>
        </div>

        {/* Show a notification when the timer is finished */}
        {isTimerFinished && (
          <p className="text-pink-800 font-semibold mt-4">Timer completed! Ding! 🎉</p>
        )}
      </div>
    </div>
  ) : null;
};

export default TimerModal;
