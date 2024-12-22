import React, { ChangeEvent, useRef } from 'react';
import { PaperPlaneIcon } from '@radix-ui/react-icons';
import { Mic } from 'lucide-react';

interface MessageInputProps {
  inputMessage: string;
  handleInputChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  handleKeyPress: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
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
  const textareaRef = useRef<HTMLTextAreaElement>(null); // Reference for the textarea

  const handleSendMessageWithReset = () => {
    handleSendMessage(); // Send the message first

    // Reset textarea height and input value
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset height
      textareaRef.current.value = ''; // Clear input value
    }
  };

  return (
    <div className="relative p-2 mb-2">
      {/* Textarea with dynamic resizing */}
      <div className="flex items-center bg-slate-500/30 backdrop-blur-lg shadow-lg ring-1 ring-black/5 rounded-3xl border border-slate-400 p-1">
        <textarea
          ref={textareaRef} // Attach the ref
          value={inputMessage}
          onChange={(e) => {
            handleInputChange(e);
            e.target.style.height = 'auto'; // Reset height to auto for re-calculation
            e.target.style.height = `${e.target.scrollHeight}px`; // Set height based on scrollHeight
          }}
          onKeyDown={handleKeyPress} // Ensure this prop is passed and used
          placeholder="  ...ask me for a great recipe"
          className="flex-1 bg-transparent text-white text-base ml-2 placeholder-gray-400 focus:outline-none resize-none overflow-hidden"
          rows={1}
          disabled={isLoading}
        />
        
        {/* Send Button */}
        <button
          onClick={handleSendMessageWithReset} // Use the new handler
          className="p-2 rounded-full bg-[#27ff52] text-black shadow-lg hover:shadow-xl transition-shadow"
          disabled={isLoading}
        >
          <PaperPlaneIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
