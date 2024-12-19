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

  // Ref to store onStepChange for stable useEffect behavior
  const onStepChangeRef = useRef(onStepChange);
  useEffect(() => {
    onStepChangeRef.current = onStepChange;
  }, [onStepChange]);

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
        console.log("SpeechRecognition result event fired."); // Add this
      const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
      console.log("Voice Command:", transcript);

      if (transcript.includes("next")) {
        console.log("Command recognized: next"); // Add this
        setCurrentStep((prevStep) => {
          const nextStep = Math.min(prevStep + 1, instructions.length - 1);
          console.log(`Advanced to Step ${nextStep + 1}`);
          return nextStep;
        });
      } else if (transcript.includes("back")) {
        setCurrentStep((prevStep) => {
          const prevStepValue = Math.max(prevStep - 1, 0);
          console.log(`Moved back to Step ${prevStepValue + 1}`);
          return prevStepValue;
        });
      } else if (transcript.includes("pause")) {
        stopListening();
        console.log("Voice Control paused.");
      } else {
        console.log("Unrecognized command.");
      }

      (recognitionInstance as EnhancedSpeechRecognition).onend = () => {
        console.log("Restarting recognition...");
        recognitionInstance.start();
      };      
    };

    recognitionInstance.onerror = (event) => {
        console.warn("SpeechRecognition error:", event.error);
      
        if (event.error === "aborted" || event.error === "no-speech") {
          console.warn("No speech detected or recognition aborted. Retrying...");
          // Stop and restart recognition after a small delay to stabilize
          recognitionInstance.stop();
          setTimeout(() => {
            if (!recognitionRunning) {
              console.log("Retrying recognition...");
              recognitionInstance.start();
              setRecognitionRunning(true);
            }
          }, 500); // Delay to prevent immediate overlap
          return;
        }
      
        // Log and set error for any unexpected issues
        console.error("Unhandled SpeechRecognition error:", event.error);
        setError(`Voice recognition error: ${event.error}`);
      };
      
      

    setRecognition(recognitionInstance);
  }, [instructions]);

  // Trigger onStepChange after currentStep updates, with a guard for stability
  useEffect(() => {
    console.log("Notifying parent component of current step:", currentStep);
    if (onStepChangeRef.current) {
      onStepChangeRef.current(currentStep);
    }
  }, [currentStep]);

  const startListening = () => {
    if (!recognition || recognitionRunning) {
      console.warn("Recognition is already running or unavailable.");
      return;
    }
  
    try {
      recognition.start();
      setRecognitionRunning(true);
      console.log("Voice Control started.");
    } catch (err) {
      console.error("Error starting SpeechRecognition:", err);
      setError("Failed to start voice control. Please try again.");
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
