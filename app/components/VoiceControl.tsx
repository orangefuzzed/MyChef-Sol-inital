import React, { useState, useEffect, useRef } from "react";

interface VoiceControlProps {
  instructions: string[];
  onStepChange: (currentStep: number) => void;
}

interface EnhancedSpeechRecognition extends SpeechRecognition {
  onend: (() => void) | null;
}

const VoiceControl: React.FC<VoiceControlProps> = ({ instructions, onStepChange }) => {
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [recognitionRunning, setRecognitionRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Ref to track retries across renders
  const retryCountRef = useRef(0);
  const MAX_RETRIES = 3;

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Your browser does not support Voice Recognition. Please use Google Chrome.");
      return;
    }

    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = false;
    recognitionInstance.lang = "en-US";

    recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
      console.log("Voice Command:", transcript);

      if (transcript.includes("next")) {
        setCurrentStep((prevStep) => {
          const nextStep = Math.min(prevStep + 1, instructions.length - 1);
          onStepChange(nextStep);
          return nextStep;
        });
      } else if (transcript.includes("back")) {
        setCurrentStep((prevStep) => {
          const prevStepValue = Math.max(prevStep - 1, 0);
          onStepChange(prevStepValue);
          return prevStepValue;
        });
      } else if (transcript.includes("pause")) {
        stopListening();
      } else {
        console.log("Unrecognized command.");
      }
    };

    recognitionInstance.onerror = (event) => {
      console.warn("SpeechRecognition error:", event.error);

      if (event.error === "aborted" || event.error === "no-speech") {
        console.warn("No speech detected or recognition aborted. Retrying...");

        if (retryCountRef.current >= MAX_RETRIES) {
          console.error("Max retries reached. Stopping recognition.");
          stopListening();
          setError("Voice recognition failed. Please try again.");
          return;
        }

        retryCountRef.current++;
        console.log(`Retrying recognition... Attempt ${retryCountRef.current}/${MAX_RETRIES}`);

        setTimeout(() => {
          if (!recognitionRunning) {
            try {
              recognitionInstance.start();
              setRecognitionRunning(true);
              console.log("Recognition restarted successfully.");
            } catch (err) {
              console.error("Error restarting recognition:", err);
              setError("Failed to restart voice control.");
            }
          }
        }, 1000); // 1-second cooldown
      } else {
        console.error("Unhandled SpeechRecognition error:", event.error);
        setError(`Voice recognition error: ${event.error}`);
        stopListening();
      }
    };

    // This ensures `onend` is properly assigned
    (recognitionInstance as EnhancedSpeechRecognition).onend = () => {
      console.log("Recognition ended. Checking if restart is needed...");
      if (recognitionRunning && retryCountRef.current < MAX_RETRIES) {
        try {
          recognitionInstance.start();
        } catch (err) {
          console.error("Error restarting recognition:", err);
          setError("Failed to restart voice control.");
        }
      }
    };

    setRecognition(recognitionInstance);
    return () => {
      recognitionInstance.abort();
    };
  }, [instructions, onStepChange]);

  const startListening = () => {
    if (!recognition || recognitionRunning) {
      console.warn("Recognition is already running or unavailable.");
      return;
    }

    try {
      recognition.start();
      setRecognitionRunning(true);
      retryCountRef.current = 0; // Reset retries on new start
      console.log("Voice Control started.");
    } catch (err) {
      console.error("Error starting SpeechRecognition:", err);
      setError("Failed to start voice control.");
    }
  };

  const stopListening = () => {
    if (!recognition || !recognitionRunning) {
      console.warn("Recognition is already stopped or unavailable.");
      return;
    }

    try {
      recognition.stop();
      setRecognitionRunning(false);
      console.log("Voice Control stopped.");
    } catch (err) {
      console.error("Error stopping SpeechRecognition:", err);
    }
  };

  return (
    <div className="voice-control">
      <button
        className={`p-2 px-6 ${recognitionRunning ? "bg-green-500" : "bg-gray-500"} text-white rounded-full shadow-lg`}
        onClick={recognitionRunning ? stopListening : startListening}
      >
        {recognitionRunning ? "Stop Voice Control" : "Start Voice Control"}
      </button>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default VoiceControl;
