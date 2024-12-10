import React from 'react';
import { RefreshCw, Repeat2 } from 'lucide-react';

interface ActionButtonsProps {
  handleRegenerateResponse: () => void;
  handleRetry: () => void;
  lastAIResponse: {
    id: number;
    text: string;
    sender: 'user' | 'ai' | 'system';
  } | null;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  handleRegenerateResponse,
  handleRetry,
  lastAIResponse,
}) => {
  if (!lastAIResponse) return null;

  return (
    <div className="flex gap-2 mt-2">
      {lastAIResponse?.sender === 'system' && lastAIResponse.text.toLowerCase().includes('chaotic') && (
        <button
          onClick={handleRetry}
          className="p-2 px-4 bg-orange-500 text-white rounded-full flex items-center gap-2 hover:bg-orange-600 transition"
          >
            <RefreshCw className="w-5 h-5" />
            Retry my last request!
        </button>
      )}

      {lastAIResponse.sender === 'ai' && (
        <button
        onClick={handleRegenerateResponse}
        className="p-2 px-4 bg-[#27ff52] text-md rounded-full text-black flex items-center gap-2"
      >
        Get More Suggestions
        <Repeat2 className="w-5 h-5 text-black" />
      </button>      
      )}
    </div>
  );
};

export default ActionButtons;
