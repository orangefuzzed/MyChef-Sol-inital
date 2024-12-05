import React from 'react';
import { ReloadIcon } from '@radix-ui/react-icons';

interface ActionButtonsProps {
  handleRegenerateResponse: () => void;
  handleContinueResponse: () => void;
  handleRetryOverload: () => void;
  lastAIResponse: {
    id: number;
    text: string;
    sender: 'user' | 'ai' | 'system';
  } | null;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  handleRegenerateResponse,
  handleContinueResponse,
  handleRetryOverload,
  lastAIResponse,
}) => {
  if (!lastAIResponse) return null;

  return (
    <div className="flex gap-2 mt-2">
      {lastAIResponse.sender === 'system' && (
        <>
          {lastAIResponse.text.includes('cut off') && (
            <button
              onClick={handleContinueResponse}
              className="p-2 px-4 bg-teal-600 text-white rounded-full"
            >
              Continue Response
            </button>
          )}
          {lastAIResponse.text.includes('overloaded') && (
            <button
              onClick={handleRetryOverload}
              className="p-2 px-4 bg-orange-400 text-white rounded-full flex items-center gap-2"
            >
              Retry
            </button>
          )}
        </>
      )}
      {lastAIResponse.sender === 'ai' && (
        <button
          onClick={handleRegenerateResponse}
          className="p-2 px-4 bg-sky-500 text-white rounded-full flex items-center gap-2"
        >
          <ReloadIcon className="w-5 h-5" />
          Get More Suggestions
        </button>
      )}
    </div>
  );
};

export default ActionButtons;
