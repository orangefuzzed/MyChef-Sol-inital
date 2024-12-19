import React, { useState, useEffect, useRef } from "react";

interface VoiceControlProps {
  instructions: string[];
  onStepChange: (currentStep: number) => void;
}

const VoiceControl: React.FC<VoiceControlProps> = ({ instructions, onStepChange }) => {
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [recognitionRunning, setRecognitionRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

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
      retryCountRef.current = 0; // Reset retries on successful interaction
      const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
      console.log("Voice Command:", transcript);

      if (transcript.includes("next")) {
        setCurrentStep((prevStep) => Math.min(prevStep + 1, instructions.length - 1));
      } else if (transcript.includes("back")) {
        setCurrentStep((prevStep) => Math.max(prevStep - 1, 0));
      } else if (transcript.includes("pause")) {
        stopListening();
      } else {
        console.log("Unrecognized command.");
      }
    };

    recognitionInstance.onerror = (event) => {
      console.warn("SpeechRecognition error:", event.error);

      if (event.error === "no-speech" || event.error === "aborted") {
        if (retryCountRef.current >= MAX_RETRIES) {
          console.error("Max retries reached. Stopping recognition.");
          stopListening();
          setError("Voice recognition failed. Please retry.");
          return;
        }

        retryCountRef.current += 1;
        console.log(`Retrying recognition... Attempt ${retryCountRef.current}/${MAX_RETRIES}`);

        setTimeout(() => {
          if (!recognitionRunning) {
            try {
              recognitionInstance.start();
              console.log("Recognition restarted successfully.");
            } catch (err) {
              console.error("Failed to restart recognition:", err);
            }
          }
        }, 1000);
      } else {
        console.error("Unhandled error:", event.error);
        setError(`Voice recognition error: ${event.error}`);
        stopListening();
      }
    };

    recognitionInstance.onend = () => {
      console.log("Recognition ended. Checking if restart is needed...");
      if (recognitionRunning && retryCountRef.current < MAX_RETRIES) {
        try {
          recognitionInstance.start();
          console.log("Recognition restarted after end event.");
        } catch (err) {
          console.error("Failed to restart after end event:", err);
        }
      }
    };

    setRecognition(recognitionInstance);
  }, []);

  const startListening = () => {
    if (!recognition || recognitionRunning) return;

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
    if (!recognition || !recognitionRunning) return;

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
