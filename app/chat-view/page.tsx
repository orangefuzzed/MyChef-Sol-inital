// ChatViewPage.tsx - Updated for SearchParams Handling and Best Practices
'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '../components/Header';
import MessageList from '../components/AIChatInterface/MessageList';
import MessageInput from '../components/AIChatInterface/MessageInput';
import LoadingSpinner from '../components/LoadingSpinner';
import Footer from '../components/Footer';
import { getSavedSessionsFromDB } from '../utils/indexedDBUtils';
import { useChat } from '../contexts/ChatContext';
import { sendMessageToClaude } from '../services/claudeService';
import { ChatMessage } from '../../types/ChatMessage';
import { RecipeSuggestionSet } from '../../types/Recipe';
import RecipeSuggestions from '../components/AIChatInterface/RecipeSuggestions';

const ChatViewPageWrapper = () => {
  return (
    <Suspense fallback={<div>Loading Chat View...</div>}>
      <ChatViewPage />
    </Suspense>
  );
};

const ChatViewPage: React.FC = () => {
  const { messages, setMessages, isLoading, setIsLoading, inputMessage, setInputMessage } = useChat();
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams ? searchParams.get('sessionId') : null; // Null-check for `searchParams`
  const [recipeSuggestionSets, setRecipeSuggestionSets] = useState<RecipeSuggestionSet[]>([]);
  const [sessionTitle, setSessionTitle] = useState<string>('Chat Session');
  const [hydrationReady, setHydrationReady] = useState(false);

  // Set hydration ready once component mounts to prevent rendering issues
  useEffect(() => {
    setHydrationReady(true);
  }, []);

  // Load session messages on component mount
  useEffect(() => {
    if (!sessionId) {
      console.error('No session ID provided');
      return;
    }

    const loadSessionMessages = async () => {
      setIsLoading(true);

      try {
        // Load saved sessions from IndexedDB
        const savedSessions = await getSavedSessionsFromDB();
        let session = savedSessions.find((s) => s.sessionId === sessionId);

        // Fetch from MongoDB if no session found in IndexedDB
        if (!session) {
          const response = await fetch(`/api/sessions/${sessionId}`);
          if (response.ok) {
            session = await response.json();
          } else {
            console.error('Failed to load session from MongoDB');
          }
        }

        if (session) {
          setMessages(session.messages);
          setSessionTitle(session.sessionTitle || 'Chat Session');

          // Extract recipe suggestions from messages, ensuring suggestions is always an array
          const recipeSets: RecipeSuggestionSet[] = session.messages
            .filter((message: ChatMessage) => message.suggestions && message.suggestions.length > 0)
            .map((message: ChatMessage) => ({
              responseId: message.messageId,
              message: message.text,
              suggestions: message.suggestions ?? [], // Provide an empty array if undefined
            }));

          setRecipeSuggestionSets(recipeSets);
        }
      } catch (error) {
        console.error('Error loading session messages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSessionMessages();
  }, [sessionId, setMessages, setIsLoading]);

  // Handle sending message from input
  const handleSendMessageClick = async () => {
    if (inputMessage.trim()) {
      setIsLoading(true);
      try {
        const newMessage: ChatMessage & { id: number } = {
          id: Date.now(),
          messageId: Date.now().toString(),
          sessionId: sessionId || 'current_session',
          timestamp: new Date(),
          sender: 'user',
          text: inputMessage,
        };

        // Create the updated messages array
        const updatedMessages: ChatMessage[] = [...messages, newMessage];

        // Set the updated messages array to state
        setMessages(updatedMessages);

        // Send message to Claude
        await sendMessageToClaude(inputMessage, 'chat');
      } catch (error) {
        console.error('Error sending message:', error);
      } finally {
        setIsLoading(false);
        setInputMessage('');
      }
    }
  };

  if (!hydrationReady) {
    return null; // Prevent rendering until hydration is ready
  }

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white overflow-hidden">
      {/* Header */}
      <Header centralText={sessionTitle} backButton={{ label: 'Back', onClick: () => router.back() }} />

      {/* Main Content */}
      <div className="flex-grow p-8 overflow-y-auto">
        <MessageList
          messages={messages}
          lastAIResponse={null} // Since we're viewing a past session, lastAIResponse can be null or not needed
          handleContinueResponse={() => {}} // Provide a no-op function or you can remove this functionality for session viewing
          handleRetryOverload={() => {}}
          handleRegenerateResponse={() => {}}
        />

        {/* Recipe Suggestions in Context with Messages */}
        {recipeSuggestionSets.map((suggestionSet) => (
          <div key={suggestionSet.responseId} className="mt-4">
            <p className="text-sm text-gray-400">{suggestionSet.message}</p>
            <RecipeSuggestions
              currentRecipeList={suggestionSet.suggestions}
              handleRecipeSelect={() => {}} // No selection action needed for saved sessions
            />
          </div>
        ))}

        {/* Loading Spinner */}
        <LoadingSpinner isLoading={isLoading} loadingMessage="Chatting..." />
      </div>

      {/* Input Section */}
      <MessageInput
        inputMessage={inputMessage}
        handleInputChange={(e) => setInputMessage(e.target.value)}
        handleKeyPress={(e) => {
          if (e.key === 'Enter') handleSendMessageClick();
        }}
        handleSendMessage={handleSendMessageClick}
        isLoading={isLoading}
      />

      {/* Footer Section with Save Session Button */}
      <Footer actions={['home', 'save', 'favorite', 'send']} />
    </div>
  );
};

export default ChatViewPageWrapper;
