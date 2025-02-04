import React, { ChangeEvent, useRef, useEffect, useState } from 'react';
import { PaperPlaneIcon} from '@radix-ui/react-icons';
import {  Wheat, WheatOff } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import Toast from '../../components/Toast';


interface MessageInputProps {
  inputMessage: string;
  handleInputChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  handleKeyPress: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
  isPreferencesActive: boolean; // Preferences toggle state
  preferences: Record<string, any>; // User preferences object
  togglePreferences: () => void; // Toggle preferences state
  handleSendMessage: (payload: { message: string; preferences?: Record<string, any> }) => void; // Updated function signature
}

const MessageInput: React.FC<MessageInputProps> = ({
  inputMessage,
  handleInputChange,
  handleKeyPress,
  handleSendMessage,
  isLoading,
  isPreferencesActive,
  preferences,
  togglePreferences,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null); // Reference for the textarea
  const searchParams = useSearchParams() ?? new URLSearchParams(); // Ensure it's never null
  const prefilledPrompt = searchParams.get('prompt') || ''; // Default to an empty string if no prompt
  
  const [toastList, setToastList] = useState<
    { id: number; message: string; type: 'success' | 'warning' }[]
  >([]); // Toast state

  const handleTogglePreferences = () => {
    // Toggle the preferences state
    togglePreferences();
    triggerParticleBurst();

    const audio = new Audio('/audio/toggle-click.wav'); // Add your sound file in /public/sounds
    audio.play();

    // Add a toast notification
    const toastMessage = isPreferencesActive
      ? 'Preferences will not be applied to your requests.' // Toggle OFF message
      : 'Preferences will now be applied to your requests.'; // Toggle ON message

    const id = Date.now(); // Unique ID for the toast
    setToastList((prev) => [
      ...prev,
      { id, message: toastMessage, type: 'success' },
    ]);

    // Auto-remove toast after 3 seconds
    setTimeout(() => {
      setToastList((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  };

  const [isParticlesActive, setIsParticlesActive] = useState(false);

  const triggerParticleBurst = () => {
    setIsParticlesActive(true);
    setTimeout(() => setIsParticlesActive(false), 600); // Match particle animation duration
  };


  // Pre-fill the input field if there's a prompt in the URL
  useEffect(() => {
    if (prefilledPrompt && textareaRef.current) {
      textareaRef.current.value = prefilledPrompt; // Set the textarea's value
      textareaRef.current.style.height = 'auto'; // Reset height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Adjust height dynamically
    }
  }, [prefilledPrompt]);

  // Updated send message logic
  const handleSendMessageWithPreferences = () => {
    if (!inputMessage.trim()) {
      return; // Prevent sending empty messages
    }

    // Build the payload based on preferences toggle
    const payload = {
      message: inputMessage,
      ...(isPreferencesActive && { preferences }), // Conditionally add preferences
    };

    handleSendMessage(payload); // Call the parent function with the payload

    // Reset textarea height and input value
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset height
      textareaRef.current.value = ''; // Clear input value
    }
  };

  return (
    <div className="relative p-2 mb-1">
      {/* Toast Container */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 space-y-4">
        {toastList.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() =>
              setToastList((prev) => prev.filter((t) => t.id !== toast.id))
            }
          />
        ))}
      </div>
      {/* Parent Flex Container */}
      <div className="flex items-center">
        {/* Input Section */}
        <div className="flex flex-1 items-center bg-slate-500/30 backdrop-blur-lg shadow-lg ring-1 ring-black/5 rounded-3xl border border-slate-400 p-1">
          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={inputMessage}
            onChange={(e) => {
              handleInputChange(e);
              e.target.style.height = 'auto';
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            onKeyDown={handleKeyPress}
            placeholder="  ...ask me for a great recipe"
            className="flex-1 bg-transparent text-white text-base ml-2 placeholder-gray-400 focus:outline-none resize-none overflow-hidden"
            rows={1}
            disabled={isLoading}
          />
  
          {/* Send Button */}
            <button
              onClick={handleSendMessageWithPreferences}
              className={`p-2 rounded-full transition-all duration-300 ease-in-out ${
                inputMessage.trim()
                  ? 'bg-[#27ff52] text-black border border-sky-50 shadow-lg hover:shadow-xl transform scale-100' // Active state
                  : 'bg-gray-400 text-gray-700 transform scale-75' // Default state
              }`}
              disabled={isLoading}
            >
              <PaperPlaneIcon
                className={`h-4 w-4 transition-transform duration-300 ease-in-out ${
                  inputMessage.trim() ? 'scale-125' : 'scale-100'
                }`}
              />
            </button>
        </div>
  
        {/* Preferences Toggle Button */}
          <div className="relative">
            <button
              onClick={() => {
                handleTogglePreferences(); // Toggle preferences

              }}
              className={`ml-2 p-2 rounded-full  ${
                isPreferencesActive
                  ? 'wave-pop-effect bg-[#27ff52] border border-sky-50 text-black'
                  : 'border border-gray-500 bg-slate-950/30 text-gray-500'
              } shadow-lg hover:shadow-xl transition-shadow`}
              disabled={isLoading}
              title="Toggle Preferences"
            >
              {isPreferencesActive ? (
                <WheatOff strokeWidth={1.5} className="h-5 w-5" />
              ) : (
                <Wheat strokeWidth={1.5} className="h-5 w-5" />
              )}
            </button>
          </div>
      </div>
    </div>
  );
};

export default MessageInput;
