import React, { ChangeEvent, KeyboardEvent } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, PaperPlaneIcon } from '@radix-ui/react-icons';
import { MicrophoneIcon } from '@heroicons/react/24/solid';

interface MessageInputProps {
  inputMessage: string;
  handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleKeyPress: (event: KeyboardEvent<HTMLInputElement>) => void;
  handleSendMessage: () => void;
  isLoading: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  inputMessage,
  handleInputChange,
  handleKeyPress,
  handleSendMessage,
  isLoading,
}) => {
  return (
    <div className="p-4 bg-gray-800">
      <div className="flex items-center bg-white rounded-full p-2">
        <input
          type="text"
          value={inputMessage}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="...ask me for a great recipe"
          className="flex-1 bg-transparent text-black placeholder-gray-400 focus:outline-none"
          disabled={isLoading}
        />
        <div className="flex space-x-2">
          <button className="p-1 text-gray-400" disabled={isLoading}>
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <button className="p-1 text-gray-400" disabled={isLoading}>
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
        <button
          onClick={handleSendMessage}
          className="p-3 rounded-full bg-[#CA244D] text-white ml-2"
          disabled={isLoading}
        >
          <PaperPlaneIcon className="h-4 w-4" />
        </button>
        <button className="p-2 rounded-full bg-[#ffffff] text-black ml-2">
          <MicrophoneIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;