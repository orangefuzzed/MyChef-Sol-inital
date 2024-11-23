import { CrossCircledIcon, ArrowRightIcon, ArrowLeftIcon } from '@radix-ui/react-icons'; // Radix UI icons
import { ChefHat } from 'lucide-react';
import React, { useState } from 'react';

// Define the CookModeProps interface
interface CookModeProps {
  recipeTitle: string;
  instructions: string[];
  onClose: () => void;
}

const CookMode: React.FC<CookModeProps> = ({ recipeTitle, instructions, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNextStep = () => {
    if (currentStep < instructions.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="cook-mode-modal">
      <div className="cook-mode-content">
        {/* Header with Chef Hat Icon and Close Icon */}
        <div className="cook-mode-header">
          <ChefHat className="cook-mode-icon" />
          <CrossCircledIcon className="cook-mode-close" onClick={onClose} />
        </div>

        {/* Title */}
        <h2 className="cook-mode-title">{recipeTitle}</h2>

        {/* Current Step */}
        <div className="cook-mode-step">
        <p>Step {currentStep + 1} of {instructions.length}</p>
          <p>{instructions[currentStep]}</p>
        </div>

        {/* Navigation Buttons */}
        <div className="cook-mode-buttons">
          <button onClick={handlePreviousStep} disabled={currentStep === 0} className="cook-mode-button">
            <ArrowLeftIcon /> Previous Step
          </button>
          <button onClick={handleNextStep} disabled={currentStep === instructions.length - 1} className="cook-mode-button">
            Next Step <ArrowRightIcon />
          </button>
        </div>

        {/* Close Button */}
        <button onClick={onClose} className="close-modal-button">
          Close Cook Mode
        </button>
      </div>
    </div>
  );
};

export default CookMode;