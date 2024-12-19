import React, { useEffect, useState } from "react";
import VoiceControl from "../VoiceControl";

interface CookModeProps {
  cookModeData: string[]; // Array of instructions
  recipeTitle: string; // The recipe title
}

const CookMode: React.FC<CookModeProps> = ({ cookModeData, recipeTitle }) => {
  const [wakeLock, setWakeLock] = useState<null | WakeLockSentinel>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [screenActive, setScreenActive] = useState(false);

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
  };

  const requestWakeLock = async () => {
    try {
      if ("wakeLock" in navigator) {
        const lock = await navigator.wakeLock.request("screen");
        setWakeLock(lock);
        setScreenActive(true);
        console.log("Wake Lock is active");

        lock.addEventListener("release", () => {
          console.log("Wake Lock was released");
          setWakeLock(null);
          setScreenActive(false);
        });
      } else {
        console.warn("Wake Lock API not supported.");
      }
    } catch (err) {
      console.error("Failed to activate wake lock:", err);
      setError("Failed to keep screen awake.");
    }
  };

  const releaseWakeLock = () => {
    if (wakeLock) {
      wakeLock.release();
      setWakeLock(null);
      setScreenActive(false);
      console.log("Wake Lock released.");
    }
  };

  useEffect(() => {
    requestWakeLock();
    return () => releaseWakeLock();
  }, []);

  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timeout);
    }
  }, [error]);

  return (
    <div className="cook-mode bg-white/30 backdrop-blur-lg border-white border shadow-lg ring-1 ring-black/5 p-6 rounded-2xl">
      <h2 className="text-2xl font-medium text-sky-50 text-center">
        Let&apos;s Cook Your {recipeTitle}!
      </h2>
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      {screenActive && (
        <p className="text-green-400 text-center mt-2">
          Screen is being kept awake.
        </p>
      )}
      <div className="py-3 flex items-center text-sm text-black before:flex-1 before:border-t before:border-pink-800 before:me-6 after:flex-1 after:border-t after:border-pink-800 after:ms-6 dark:text-white dark:before:border-neutral-600 dark:after:border-neutral-600">
        INSTRUCTIONS
      </div>
      <div className="mb-6 text-center">
        <p className="text-lg font-medium text-sky-50 mb-4">
          {cookModeData[currentStep]}
        </p>
        <VoiceControl instructions={cookModeData} onStepChange={handleStepChange} />
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
