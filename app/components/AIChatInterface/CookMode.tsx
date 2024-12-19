import React, { useEffect, useState } from "react";
import VoiceControl from "../VoiceControl";

interface CookModeProps {
  cookModeData: string[];
  recipeTitle: string;
}

const CookMode: React.FC<CookModeProps> = ({ cookModeData, recipeTitle }) => {
  const [wakeLock, setWakeLock] = useState<null | WakeLockSentinel>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true); // Toggle for TTS

  const speakStep = (step: string) => {
    if (!ttsEnabled || !("speechSynthesis" in window)) return;

    const utterance = new SpeechSynthesisUtterance(step);
    utterance.lang = "en-US";
    utterance.rate = 1.1; // Slightly faster speech
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    window.speechSynthesis.cancel(); // Cancel any ongoing speech
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    // Speak the current step when it changes
    if (ttsEnabled && cookModeData[currentStep]) {
      speakStep(`Step ${currentStep + 1}: ${cookModeData[currentStep]}`);
    }
  }, [currentStep, cookModeData, ttsEnabled]);

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
  };

  const toggleTts = () => {
    setTtsEnabled((prev) => !prev);
    if (isSpeaking) {
      window.speechSynthesis.cancel();
    }
  };

  const requestWakeLock = async () => {
    try {
      if ("wakeLock" in navigator) {
        const lock = await navigator.wakeLock.request("screen");
        setWakeLock(lock);
        console.log("Wake Lock is active");

        lock.addEventListener("release", () => {
          console.log("Wake Lock was released");
          setWakeLock(null);
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

      <div className="py-3 flex items-center text-sm text-black before:flex-1 before:border-t before:border-pink-800 before:me-6 after:flex-1 after:border-t after:border-pink-800 after:ms-6 dark:text-white dark:before:border-neutral-600 dark:after:border-neutral-600">
        INSTRUCTIONS
      </div>

      <div className="mb-6 text-center">
        <VoiceControl instructions={cookModeData} onStepChange={handleStepChange} />
        <button
          className={`mt-4 p-2 px-6 ${
            ttsEnabled ? "bg-green-500" : "bg-gray-500"
          } text-white rounded-full shadow-lg`}
          onClick={toggleTts}
        >
          {ttsEnabled ? "Disable TTS" : "Enable TTS"}
        </button>
      </div>

      <ol className="list-decimal pl-6 text-base text-white text-lg leading-relaxed space-y-4">
        {cookModeData.map((step, index) => (
          <li
            key={index}
            className={`mb-2 ${index === currentStep ? "font-bold" : ""}`}
          >
            {step}
          </li>
        ))}
      </ol>
    </div>
  );
};

export default CookMode;
