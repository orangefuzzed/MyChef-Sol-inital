import React from 'react';
import Message from './Message';
import { Message as MessageType } from '../../../types/Message';

interface MessageListProps {
  messages: MessageType[];
  /*lastAIResponse: MessageType | null;
  handleContinueResponse: () => void;
  handleRetryOverload: () => void;
  handleRegenerateResponse: () => void;*/
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  /*lastAIResponse,
  handleContinueResponse,
  handleRetryOverload,
  handleRegenerateResponse,*/
}) => (
  <>
    {messages.map((message) => (
      <Message
        key={message.id}
        message={message}
        /*lastAIResponse={lastAIResponse}
        handleContinueResponse={handleContinueResponse}
        handleRetryOverload={handleRetryOverload}
        handleRegenerateResponse={handleRegenerateResponse}*/
      />
    ))}
  </>
);

export default MessageList;
