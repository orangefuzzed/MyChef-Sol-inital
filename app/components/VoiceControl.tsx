"use client";
import React, { useEffect } from "react";

interface VoiceControlProps {
  onStepChange: (step: "next" | "back" | "repeat" | "pause") => void;
}

const VoiceControl: React.FC<VoiceControlProps> = ({ onStepChange }) => {
  useEffect(() => {
    // Ensure code runs only in the browser
    if (typeof window === "undefined") return;

    // Dynamically require annyang at runtime, not at build time
    const annyang = require("annyang").default;

    if (annyang) {
      const commands = {
        next: () => {
          console.log("Command recognized: next");
          onStepChange("next");
        },
        back: () => {
          console.log("Command recognized: back");
          onStepChange("back");
        },
        repeat: () => {
          console.log("Command recognized: repeat");
          onStepChange("repeat");
        },
        pause: () => {
          console.log("Command recognized: pause");
          onStepChange("pause");
        },
      };

      annyang.addCommands(commands);
      annyang.start({ autoRestart: true, continuous: true });

      console.log("Annyang voice control started.");

      return () => {
        annyang?.abort();
        console.log("Annyang voice control stopped.");
      };
    } else {
      console.error("Annyang is not supported in this browser.");
    }
  }, [onStepChange]);

  return (
    <div className="voice-control">
      <p className="text-green-500">Voice control active. Say "next", "back", "repeat", or "pause".</p>
    </div>
  );
};

export default VoiceControl;
