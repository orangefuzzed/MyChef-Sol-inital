import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { Message as MessageType } from '../../../types/Message';
import { CircleUserRound } from 'lucide-react';
import Image from 'next/image';
import axios from 'axios';
import styles from '../HamburgerMenu.module.css'; // Import the styles for avatar


interface MessageProps {
  message: MessageType;
  /*lastAIResponse: MessageType | null;
  handleContinueResponse: () => void;
  handleRetryOverload: () => void;
  handleRegenerateResponse: () => void;*/
}

const Message: React.FC<MessageProps> = ({
  message,
  /*lastAIResponse,
  handleContinueResponse,
  handleRetryOverload,
  handleRegenerateResponse*/
}) => {

  const [userImage, setUserImage] = useState<string | null>(null);

  // Fetch user's avatar URL from the API endpoint
  useEffect(() => {
    const fetchUserAvatar = async () => {
      try {
        const response = await axios.get('/api/account'); // This endpoint will handle fetching from the DB
        if (response.status === 200) {
          const account = response.data.account;
          if (account.avatarUrl) {
            setUserImage(account.avatarUrl);
          }
        }
      } catch (error) {
        console.error('Failed to fetch user avatar:', error);
      }
    };

    fetchUserAvatar();
  }, []);

  return (
    <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} relative`}>
      {/* Icon positioned beside the message bubble */}
      <div
        className={`absolute ${message.sender === 'user' ? 'right-0 mr-0' : '-left-2'} top-1/2 transform -translate-y-1/2 z-[5] bg-black w-10 h-10 border border-white rounded-full flex items-center justify-center`}
      >
        {message.sender === 'user' ? (
          userImage ? (
            <Image
              src={userImage}
              alt="User Avatar"
              width={40}
              height={40}
              className={styles.avatarImageChat}
            />
          ) : (
            <CircleUserRound className="w-6 h-6 text-white" />
          )
        ) : (
          /*<BotMessageSquare strokeWidth={1.5} className="w-6 h-6 text-white" />*/
          <Image
                src="/images/kAi.png"
                alt="kai"
                width={30}
                height={30}
              />
        )}
      </div>
  
      {/* Message Bubble */}
      <div
        className={`max-w-lg p-3 ${
          message.sender === 'user'
            ? 'ml-4 mr-4 text-white bg-[#00f5d0]/30 backdrop-blur-lg shadow-lg py-4 px-8 rounded-l-3xl rounded-b-3xl border-white border mb-2'
            : 'mr-4 ml-4 text-white bg-slate-700/30 backdrop-blur-lg shadow-lg py-4 px-8 rounded-r-3xl rounded-b-3xl border-white border mb-2'
        }`}
      >
        {message.sender === 'user' ? (
          message.text
        ) : (
          <ReactMarkdown rehypePlugins={[rehypeRaw]}>{message.text}</ReactMarkdown>
        )}
      </div>
    </div>
  );
};

export default Message;
