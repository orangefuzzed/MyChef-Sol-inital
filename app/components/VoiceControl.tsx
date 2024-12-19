import React, { useState, useEffect } from "react";

interface VoiceControlProps {
  instructions: string[];
  onStepChange: (currentStep: number) => void;
}

const VoiceControl: React.FC<VoiceControlProps> = ({ instructions, onStepChange }) => {
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      setError("Your browser does not support Voice Recognition. Please use Google Chrome.");
      return;
    }
    

    const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
  console.error("SpeechRecognition API is not supported in this browser.");
  setError(
    "Your browser does not support Voice Recognition. Please use Google Chrome or another compatible browser."
  );
  return;
}

// If we reach here, SpeechRecognition is guaranteed to exist
const recognitionInstance = new SpeechRecognition();

    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = false;
    recognitionInstance.lang = "en-US";

    recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
      console.log("Voice Command:", transcript);

      if (transcript.includes("next")) {
        if (currentStep < instructions.length - 1) {
          const nextStep = currentStep + 1;
          setCurrentStep(nextStep);
          onStepChange(nextStep);
        }
      } else if (transcript.includes("back")) {
        if (currentStep > 0) {
          const prevStep = currentStep - 1;
          setCurrentStep(prevStep);
          onStepChange(prevStep);
        }
      } else if (transcript.includes("repeat")) {
        onStepChange(currentStep);
      } else if (transcript.includes("pause")) {
        stopListening();
      }
    };

    recognitionInstance.onerror = (event) => {
      console.error("SpeechRecognition Error:", event.error);
      setError("Voice recognition error. Try restarting voice control.");
    };

    setRecognition(recognitionInstance);
  }, [currentStep, instructions]);

  const startListening = () => {
    if (recognition) {
      recognition.start();
      setIsListening(true);
      console.log("Voice Control started.");
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
      console.log("Voice Control stopped.");
    }
  };

  return (
    <div className="voice-control mt-4">
      <button
        className={`p-2 px-6 ${
          isListening ? "bg-green-500" : "bg-gray-500"
        } text-white rounded-full shadow-lg`}
        onClick={isListening ? stopListening : startListening}
      >
        {isListening ? "Stop Voice Control" : "Start Voice Control"}
      </button>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default VoiceControl;
