'use client';

import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useRouter } from 'next/navigation';
import { ChatSession } from '../../types/ChatSession';
import { getSavedSessionsFromDB, saveSessionToDB } from '../utils/indexedDBUtils';
import { MessagesSquare } from 'lucide-react';

const HistoryPage: React.FC = () => {
  const [savedSessions, setSavedSessions] = useState<ChatSession[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchAndMergeSessions = async () => {
      try {
        // Fetch local sessions from IndexedDB
        const localSessions = await getSavedSessionsFromDB();

        // Fetch remote sessions from MongoDB
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

        // Merge local and remote sessions
        const mergedSessionsMap = new Map<string, ChatSession>();
        [...localSessions, ...remoteSessions].forEach((session) =>
          mergedSessionsMap.set(session.sessionId, session)
        );

        const mergedSessions = Array.from(mergedSessionsMap.values());

        // Sync missing remote sessions to IndexedDB
        for (const remoteSession of remoteSessions) {
          if (!localSessions.some((localSession) => localSession.sessionId === remoteSession.sessionId)) {
            await saveSessionToDB(remoteSession);
          }
        }

        // Update state with merged sessions
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

  return (
    <div className="flex flex-col h-screen bg-fixed bg-cover bg-center text-white"
        style={{ backgroundImage: "url('/images/summer-deck-5.png')" }}
        >
      <Header centralText="Chat History" />

      {/* Main Content */}
      <div className="flex-grow p-8 overflow-y-auto">
        {savedSessions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {savedSessions.map((session) => (
              <div
                key={session.sessionId}
                className="bg-white/30 backdrop-blur-lg border-white border shadow-lg ring-1 ring-black/5 p-6 rounded-2xl"
                onClick={() => handleSessionClick(session.sessionId)}
              >
                {/* Left-Side Icon */}
                <div className="bg-sky-50/30 w-8 h-8 border border-white rounded-full flex items-center justify-center mb-2">
                  <MessagesSquare strokeWidth={1.5} className="w-4 h-4 text-black" /> {/* Example icon, you can change this */}
                </div>
                <h3 className="text-lg font-semibold mb-2">{session.sessionTitle || 'Chat Session'}</h3>
                <p className="text-sm text-black">{session.sessionSummary}</p>
                <p className="text-xs mt-2 text-pink-800">
                  {new Date(session.timestamp).toLocaleDateString()} - {new Date(session.timestamp).toLocaleTimeString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400">No saved sessions yet. Start chatting to see your history here!</div>
        )}
      </div>

      {/* Footer */}
      <Footer actions={['home', 'favorite', 'send']} />
    </div>
  );
};

export default HistoryPage;
