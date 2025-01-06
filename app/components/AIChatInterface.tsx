'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRecipeContext } from '../contexts/RecipeContext';
import { Recipe } from '../../types/Recipe';
import { useChat } from '../contexts/ChatContext';
import MessageList from '../components/AIChatInterface/MessageList';
import MessageInput from '../components/AIChatInterface/MessageInput';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAIChatHandlers } from '../utils/AIChatHandlers';
import { saveSessionToDB, saveChatMessageToDB } from '../utils/indexedDBUtils'; // Import for saving session
import RecipeSuggestions from '../components/AIChatInterface/RecipeSuggestions';
import { ChatSession } from '../../types/ChatSession'; // Add this import for the ChatSession type
import { ChatMessage } from '../../types/ChatMessage';
import { useRouter } from 'next/navigation';
import { Heart, CirclePlus, Home } from 'lucide-react'
import ActionButtons from '../components/AIChatInterface/ActionButtons';
import LoadingModal from '../components/LoadingModal';
import RetryModal from '../components/RetryModal'; // Import the RetryModal
import Link from 'next/link';
import Toast from '../components/Toast'; // Import the Toast component
import { useSearchParams } from 'next/navigation'; // Import this for handling URL parameters
import { usePreferencesContext } from '../contexts/PreferencesContext';


const AIChatInterface = () => {
  const [sessionId, setSessionId] = useState<string>(() => Date.now().toString());
  const {
    messages,
    setMessages,
    isLoading,
    setIsLoading,
    inputMessage,
    setInputMessage,
    lastAIResponse,
  } = useChat(); // Extract chat state from ChatContext

  const {
    recipeSuggestionSets,
    setSelectedRecipe,
  } = useRecipeContext(); // Extract RecipeContext

    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');


  const handleNewSession = () => {
    startNewSession(); // Reset the chat context
};
const [isPreferencesActive, setIsPreferencesActive] = useState(false); // Toggle state
const togglePreferences = () => {
  setIsPreferencesActive((prev) => !prev);
};
const { preferences } = usePreferencesContext(); // Access preferences from the new context
const searchParams = useSearchParams();
const prefilledPrompt = searchParams ? searchParams.get('prompt') : null; // Get the prompt from the URL

const handlePairingsRequest = async (pairingRequest: string) => {
  try {
    setIsLoading(true); // Show the loading modal
    // Call `handleSendMessage` exactly as before to maintain fetch behavior
    await handleSendMessage(pairingRequest, {}, false);
  } catch (error) {
    console.error('Error during pairings request:', error);
  } finally {
    setIsLoading(false); // Ensure the loading modal closes
  }
};



  const router = useRouter();

  const { startNewSession } = useChat();

  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  {/*const router = useRouter(); // To capture navigation events*/}

  // Import the updated chat handlers without passing setCurrentRecipeList
  const {
    handleSendMessage,
    handleRegenerateResponse,
    handleRetry,
  } = useAIChatHandlers();

  // Scroll to bottom when messages update
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    // Clear messages if we're starting a new chat
    if (!sessionId || sessionId === 'current_session_id') {
      setMessages([]); // Clear the messages to start with an empty state
    }
  }, [sessionId, setMessages]);

  // Handle sending a message and saving it with the correct sessionId
  const handleSendMessageClick = async () => {
    if (inputMessage.trim()) {
      // Ensure we have a consistent sessionId
      let activeSessionId = sessionId;
      if (!sessionId || sessionId === 'current_session_id') {
        const newSessionId = Date.now().toString();
        setSessionId(newSessionId);
        activeSessionId = newSessionId;
      } else {
        activeSessionId = sessionId;
      }
  
      const newMessage: ChatMessage = {
        id: Date.now(),
        messageId: Date.now().toString(),
        sessionId: activeSessionId,  // Use the consistent sessionId
        timestamp: new Date(),
        sender: 'user',
        text: inputMessage,
      };
  
      // Save the message to IndexedDB but don't add it to the chat state yet
      await saveChatMessage(newMessage);
  
      setIsLoading(true); // Indicate loading state
  
      try {
        // Send the message to the AI and handle response (asynchronously)
        await handleSendMessage(inputMessage, preferences, isPreferencesActive);
      } catch (error) {
        console.error('Error handling send message:', error);
      } finally {
        setIsLoading(false);
      }
  
      setInputMessage(''); // Clear the input after sending
    }
  };

  // Handle input field changes
  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(event.target.value);
  };  

  useEffect(() => {
    if (prefilledPrompt) {
      setInputMessage(prefilledPrompt); // Sync prefilled prompt with inputMessage state
    }
  }, [prefilledPrompt]);

  // Handle Enter key press
    const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault(); // Prevent newline insertion
        handleSendMessageClick();
      }
    };


  // Handle recipe selection
  const handleRecipeSelect = (recipe: Recipe) => {
    console.log("Setting selected recipe:", recipe); // Log the selected recipe for debugging
    setSelectedRecipe(recipe); // Set the selected recipe in the RecipeContext
  
    // Navigate to the recipe view page with the recipId in the URL
    router.push(`/recipe-view?id=${recipe.id}`);
  };

  // Handle saving session
  const handleSaveSession = async () => {
    try {
      const sessionSummary = messages.length > 0 ? messages[0].text.slice(0, 100) : 'No summary available';

      const sessionObject: ChatSession = {
        sessionId, // Use the consistent sessionId from state
        messages: [...messages], // Copy messages array to avoid mutation
        createdAt: new Date(),
        sessionSummary, // Create a summary using the first message or a default
        timestamp: new Date().toISOString(), // Use current time in ISO format for consistency
      };

    // Log the entire session object, each property specifically
    console.log('Session ID:', sessionObject.sessionId);
    console.log('Messages:', sessionObject.messages);
    console.log('Created At:', sessionObject.createdAt);
    console.log('Full Session Object to be Saved:', sessionObject);

      // Attempt to save to IndexedDB
      await saveSessionToDB(sessionObject); // Pass the explicitly constructed object

      // Post session to MongoDB
      const response = await fetch('/api/sessions/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sessionObject),
      });

      if (!response.ok) {
        throw new Error('Failed to save session to MongoDB');
      }

      console.log('Session saved successfully to MongoDB!');
      setIsChatSaved(true); // Mark the session as saved

      // Show success toast
      setToastMessage('Session saved successfully!');
      setToastType('success');
      setToastVisible(true);

      // Auto-hide toast
      setTimeout(() => {
        setToastVisible(false);
      }, 3000);
    } catch (error) {
      console.error('Error saving session:', error);

      // Show error toast
      setToastMessage('Failed to save session. Please try again.');
      setToastType('error');
      setToastVisible(true);

      // Auto-hide toast
      setTimeout(() => {
        setToastVisible(false);
      }, 3000);
    }
  };


  const [isChatSaved, setIsChatSaved] = useState<boolean>(false);

  // Function to save chat messages to IndexedDB with the correct sessionId
  const saveChatMessage = async (message: ChatMessage) => {
    const updatedMessage = {
      ...message,
      sessionId, // Ensure every message saved has the correct sessionId
    };

    try {
      await saveChatMessageToDB(updatedMessage);
    } catch (error) {
      console.error('Error saving chat message:', error);
    }
  }

  // Handle end session actions
  useEffect(() => {
    const handleBeforeUnload = () => {
      handleSaveSession(); // Automatically save the session before unloading
    };

    // Listen for browser close or navigation events
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup listener when component unmounts
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [messages]);

  const [showRetryModal, setShowRetryModal] = useState(false); // Correct declaration

  const handleRetryModal = async () => {
    setShowRetryModal(false); // Close the Retry Modal
    setIsLoading(true); // Show LoadingModal
    try {
      await handleRetry(); // Retry logic from handlers
    } catch (error) {
      console.error('Retry failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Open Retry Modal on error response
  useEffect(() => {
    console.log('lastAIResponse:', lastAIResponse); // Debugging
    if (
      lastAIResponse?.sender === 'system' &&
      lastAIResponse.text.toLowerCase().includes('chaotic')
    ) {
      console.log('Error detected. Showing RetryModal.');
      setShowRetryModal(true); // Trigger the modal when error occurs
    }
  }, [lastAIResponse]);

  return (
    <>
    {/* Retry Modal */}
    {showRetryModal && (
        <RetryModal
          isOpen={showRetryModal}
          onRetry={handleRetryModal}
          onClose={() => setShowRetryModal(false)}
        />
      )}

    {/* Loading Modal */}
    <LoadingModal isOpen={isLoading} />
    <div
        className="flex flex-col h-screen bg-fixed bg-cover bg-center text-white"
        style={{ backgroundImage: "url('/images/family-porch-2.png')" }}
      >
      <Header centralText="" />
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Messages Section */}
          <MessageList
            messages={messages}
            /*lastAIResponse={lastAIResponse}
            handleContinueResponse={handleContinueResponse}
            handleRetryOverload={handleRetryOverload}
            handleRegenerateResponse={handleRegenerateResponse}*/
          />

          {/* Recipe Suggestions in Context with Messages */}
          {recipeSuggestionSets.map((suggestionSet) => (
            <div key={suggestionSet.responseId} className="mt-4">
            <p className="max-w-lg px-8 py-4 rounded-r-3xl rounded-b-3xl bg-gradient-to-r from-[#00a39e] from-20% to-[#00f5d0] to-95% text-slate-950 font-medium border border-white shadow-lg ring-1 ring-black/5 mb-4">{suggestionSet.message}</p>
            <RecipeSuggestions
              currentRecipeList={suggestionSet.suggestions}
              handleRecipeSelect={handleRecipeSelect}
              onPairingsRequest={handlePairingsRequest}
            />
            </div>
          ))}

          <ActionButtons
          lastAIResponse={lastAIResponse}
          handleRetry={handleRetry}
          handleRegenerateResponse={handleRegenerateResponse}
          /> 

          {/* Scroll to Bottom Reference */}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Section */}
        <>
        <MessageInput
          inputMessage={inputMessage}
          handleInputChange={handleInputChange}
          handleKeyPress={handleKeyPress}
          handleSendMessage={handleSendMessageClick}
          isLoading={isLoading}
          isPreferencesActive={isPreferencesActive} // New prop
          preferences={preferences} // New prop
          togglePreferences={togglePreferences} // New prop
        />
      </>

        {/* Footer Section with Save Session Button */}
        <Footer
          actions={['']}
          contextualActions={[
            {
              label: '',
              icon: (
                <Link href="/" className="flex flex-col items-center mr-2">
                  <Home strokeWidth={1.5} size={18} color="white" />
                  <span className="text-xs mt-1">Home</span>
                </Link>
              ),
              onClick: () => router.push('/'), // Ensures navigation works on click
            },
            {
              label: isChatSaved ? 'Chat Saved' : 'Save Chat',
              icon: <Heart strokeWidth={1.5} size={18} color={isChatSaved ? '#9d174d' : 'white'} />,
              onClick: handleSaveSession,
            },
            {
              label: 'New Chat',
              icon: <CirclePlus strokeWidth={1.5} size={18} color={'white'} />,
              onClick: handleNewSession,
            },                               
          ]}
        />
        {/* Toast Component */}
      {toastVisible && (
        <Toast message={toastMessage} type={toastType} onClose={() => setToastVisible(false)} />
      )}
      </div>
    </>
  );
};

export default AIChatInterface;