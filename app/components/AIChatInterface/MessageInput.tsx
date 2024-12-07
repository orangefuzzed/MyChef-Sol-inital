import React, { ChangeEvent, KeyboardEvent } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, PaperPlaneIcon } from '@radix-ui/react-icons';
import { Mic } from 'lucide-react';

interface MessageInputProps {
  inputMessage: string;
  handleInputChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  handleKeyPress: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void; // Updated to use React's type
  handleSendMessage: () => void;
  isLoading: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  inputMessage,
  handleInputChange,
  handleKeyPress, // Ensure handleKeyPress is destructured here
  handleSendMessage,
  isLoading,
}) => {
  return (
    <div className="relative p-2 mb-2">
      {/* Textarea with dynamic resizing */}
      <div className="flex items-center bg-slate-500/30 backdrop-blur-lg shadow-lg ring-1 ring-black/5 rounded-full border border-slate-400 p-2">
        <textarea
          value={inputMessage}
          onChange={(e) => {
            handleInputChange(e);
            e.target.style.height = 'auto'; // Reset height to auto for re-calculation
            e.target.style.height = `${e.target.scrollHeight}px`; // Set height based on scrollHeight
          }}
          onKeyDown={handleKeyPress} // Correctly use handleKeyPress here
          placeholder="  ...ask me for a great recipe"
          className="flex-1 bg-transparent text-white text-base ml-2 placeholder-gray-400 focus:outline-none resize-none overflow-hidden"
          rows={1}
          disabled={isLoading}
        />

        {/* Navigation Buttons */}
        <div className="flex space-x-2 mr-10">
          <button className="p-1 text-gray-400" disabled={isLoading}>
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <button className="p-1 text-gray-400" disabled={isLoading}>
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
        {/* Microphone Button */}
        <button className="text-black ml-2 mr-2">
          <Mic strokeWidth={1.5} className="h-6 w-6" />
        </button>
      </div>

      {/* Send Button Detached */}
      <div className="absolute right-12 bottom-6 transform translate-y-1/2">
        <button
          onClick={handleSendMessage}
          className="p-3 rounded-full bg-[#27ff52] text-black border border-slate-400 shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out"
          disabled={isLoading}
        >
          <PaperPlaneIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
