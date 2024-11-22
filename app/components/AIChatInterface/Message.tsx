import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { PersonIcon, RocketIcon, ReloadIcon } from '@radix-ui/react-icons';
import { Message as MessageType } from '../../../types/Message';

interface MessageProps {
  message: MessageType;
  lastAIResponse: MessageType | null;
  handleContinueResponse: () => void;
  handleRetryOverload: () => void;
  handleRegenerateResponse: () => void;
}

const Message: React.FC<MessageProps> = ({
  message,
  lastAIResponse,
  handleContinueResponse,
  handleRetryOverload,
  handleRegenerateResponse,
}) => {
  return (
    <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'}`}>
        <div className="flex items-center mb-2">
          {message.sender === 'user' ? (
            <>
              <span className="text-sm mr-2">Me</span>
              <div className="rounded-full bg-[#DD005F] p-1">
                <PersonIcon className="h-4 w-4 text-white" />
              </div>
            </>
          ) : (
            <>
              <div className="rounded-full bg-gray-700 p-1 mr-2">
                <RocketIcon className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm">MyChef</span>
            </>
          )}
        </div>
        <div
          className={`max-w-lg p-3 rounded-3xl ${
            message.sender === 'user' ? 'bg-white text-black' : 'bg-gray-700 text-white'
          }`}
        >
          {message.sender === 'user' ? (
            message.text
          ) : (
            <ReactMarkdown rehypePlugins={[rehypeRaw]}>{message.text}</ReactMarkdown>
          )}
        </div>

        {/* Render buttons for the last AI response */}
        {message.id === lastAIResponse?.id && message.sender === 'system' && (
          <div className="flex gap-2 mt-2">
            {lastAIResponse.text.includes('cut off') && (
              <button
                onClick={handleContinueResponse}
                className="p-2 px-4 bg-green-600 text-white rounded-full"
              >
                Continue Response
              </button>
            )}
            {lastAIResponse.text.includes('overloaded') && (
              <button
                onClick={handleRetryOverload}
                className="p-2 px-4 bg-orange-600 text-white rounded-full flex items-center gap-2"
              >
                Retry
              </button>
            )}
          </div>
        )}

        {message.id === lastAIResponse?.id && message.sender === 'ai' && (
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleRegenerateResponse}
              className="p-2 px-4 bg-blue-600 text-white rounded-full flex items-center gap-2"
            >
              <ReloadIcon className="w-5 h-5" />
              Get More Suggestions
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
