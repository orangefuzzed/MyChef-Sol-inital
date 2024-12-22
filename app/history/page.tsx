'use client';

import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useRouter } from 'next/navigation';
import { ChatSession } from '../../types/ChatSession';
import { getSavedSessionsFromDB, saveSessionToDB, deleteChatSessionFromDB } from '../utils/indexedDBUtils'; // Added delete function
import { MessagesSquare, Trash2 } from 'lucide-react';
import Toast from '../components/Toast'; // Import the Toast component

const HistoryPage: React.FC = () => {
  const [savedSessions, setSavedSessions] = useState<ChatSession[]>([]);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const router = useRouter();

  useEffect(() => {
    const fetchAndMergeSessions = async () => {
      try {
        const localSessions = await getSavedSessionsFromDB();
        const remoteSessions: ChatSession[] = await (async () => {
          try {
            const response = await fetch('/api/sessions/saved');
            if (response.ok) {
              return await response.json();
            } else {
              console.error('Failed to fetch sessions from MongoDB:', response.statusText);
              return [];
            }
          } catch (error) {
            console.error('Error fetching sessions from MongoDB:', error);
            return [];
          }
        })();

        const mergedSessionsMap = new Map<string, ChatSession>();
        [...localSessions, ...remoteSessions].forEach((session) =>
          mergedSessionsMap.set(session.sessionId, session)
        );

        const mergedSessions = Array.from(mergedSessionsMap.values());

        for (const remoteSession of remoteSessions) {
          if (!localSessions.some((localSession) => localSession.sessionId === remoteSession.sessionId)) {
            await saveSessionToDB(remoteSession);
          }
        }

        setSavedSessions(mergedSessions);
      } catch (error) {
        console.error('Error fetching and merging sessions:', error);
      }
    };

    fetchAndMergeSessions();
  }, []);

  const handleSessionClick = (sessionId: string) => {
    router.push(`/chat-view?sessionId=${sessionId}`);
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      await deleteChatSessionFromDB(sessionId); // Remove from IndexedDB

      const response = await fetch(`/api/sessions/saved?id=${sessionId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to delete session from MongoDB');
      }

      setSavedSessions((prevSessions) =>
        prevSessions.filter((session) => session.sessionId !== sessionId)
      );

      setToastMessage('Session successfully deleted!');
      setToastType('success');
      setToastVisible(true);

      setTimeout(() => {
        setToastVisible(false);
      }, 3000);
    } catch (error) {
      console.error('Error deleting session:', error);

      setToastMessage('Failed to delete session.');
      setToastType('error');
      setToastVisible(true);

      setTimeout(() => {
        setToastVisible(false);
      }, 3000);
    }
  };

  return (
    <div
      className="flex flex-col h-screen bg-fixed bg-cover bg-center text-white"
      style={{ backgroundImage: "url('/images/soup-1.png')" }}
    >
      <Header centralText="Chat History" />

      {/* Main Content */}
      <div className="flex-grow p-8 overflow-y-auto">
        {savedSessions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {savedSessions.map((session) => (
              <div
                key={session.sessionId}
                className="bg-white/30 backdrop-blur-lg border-white border shadow-lg ring-1 ring-black/5 p-6 rounded-2xl relative"
                onClick={() => handleSessionClick(session.sessionId)}
              >
                {/* Left-Side Icon */}
                <div className="bg-sky-50/30 w-8 h-8 border border-white rounded-full flex items-center justify-center mb-2">
                  <MessagesSquare strokeWidth={1.5} className="w-4 h-4 text-black" />
                </div>

                {/* Delete Button */}
                <button
                  className="absolute top-4 right-4 bg-red-600 text-white p-2 rounded-full shadow-md hover:bg-red-500 transition"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent bubbling to the card's click handler
                    handleDeleteSession(session.sessionId);
                  }}
                  aria-label="Delete Session"
                >
                  <Trash2 size={16} />
                </button>

                <h3 className="text-lg font-light">{session.sessionTitle || 'Chat Session'}</h3>
                <p className="text-xs font-semibold mb-2 text-amber-400">
                  {new Date(session.timestamp).toLocaleDateString()} -{' '}
                  {new Date(session.timestamp).toLocaleTimeString()}
                </p>
                <p className="text-sm text-black">{session.sessionSummary}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400">
            No saved sessions yet. Start chatting to see your history here!
          </div>
        )}
      </div>

      <Footer actions={['home', 'send']} />

      {/* Toast Component */}
      {toastVisible && (
        <Toast message={toastMessage} type={toastType} onClose={() => setToastVisible(false)} />
      )}
    </div>
  );
};

export default HistoryPage;
