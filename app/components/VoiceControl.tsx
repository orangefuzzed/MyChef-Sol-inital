"use client";

import React, { useEffect, useRef } from "react";
import annyang from "annyang";

interface VoiceControlProps {
  onStepChange: (step: "next" | "back" | "repeat" | "pause") => void;
}

const VoiceControl: React.FC<VoiceControlProps> = ({ onStepChange }) => {
  const isRecognitionActive = useRef(false); // Track if recognition is active
  const restartTimeout = useRef<NodeJS.Timeout | null>(null); // For throttling restarts
  const lastErrorLogged = useRef<number>(Date.now()); // Suppress repeated logs

  useEffect(() => {
    if (annyang) {
      // Define commands
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

      // Add commands
      annyang.addCommands(commands);

      // Add error handling
      annyang.addCallback("error", (err) => {
        const now = Date.now();
        if (now - lastErrorLogged.current > 2000) {
          console.warn("Annyang error:", err);
          lastErrorLogged.current = now;
        }

        // Throttle restarts
        if (err.error === "aborted" && !restartTimeout.current) {
          console.log("Attempting to restart recognition after error...");
          restartTimeout.current = setTimeout(() => {
            annyang.resume();
            restartTimeout.current = null;
          }, 2000);
        }
      });

      annyang.addCallback("result", (userSaid: string[]) => {
        console.log("User said:", userSaid);
      });

      annyang.addCallback("start", () => {
        console.log("Recognition started.");
        isRecognitionActive.current = true;
      });

      annyang.addCallback("end", () => {
        console.log("Recognition stopped.");
        isRecognitionActive.current = false;
      });

      // Start recognition
      console.log("Starting Annyang...");
      annyang.start({ autoRestart: true, continuous: true });

      // Cleanup
      return () => {
        if (restartTimeout.current) clearTimeout(restartTimeout.current);
        annyang.abort();
        console.log("Annyang voice control stopped.");
      };
    } else {
      console.error("Annyang is not supported in this browser.");
    }
  }, [onStepChange]);

  return (
    <div className="voice-control">
      <p className="text-green-500">
        Voice control active. Say "next", "back", "repeat", or "pause".
      </p>
    </div>
  );
};

export default VoiceControl;
