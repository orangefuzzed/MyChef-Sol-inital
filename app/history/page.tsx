'use client';

import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useRouter } from 'next/navigation';
import { ChatSession } from '../../types/ChatSession';
import { getSavedSessionsFromDB, saveSessionToDB } from '../utils/indexedDBUtils';

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
    <div className="h-screen flex flex-col bg-gray-900 text-white overflow-hidden">
      {/* Header */}
      <Header centralText="Chat History" />

      {/* Main Content */}
      <div className="flex-grow p-8 overflow-y-auto">
        {savedSessions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {savedSessions.map((session) => (
              <div
                key={session.sessionId}
                className="bg-gray-800 p-4 rounded-lg cursor-pointer hover:bg-gray-700"
                onClick={() => handleSessionClick(session.sessionId)}
              >
                <h3 className="text-lg font-semibold mb-2">{session.sessionTitle || 'Chat Session'}</h3>
                <p className="text-sm text-gray-400">{session.sessionSummary}</p>
                <p className="text-xs text-gray-500 mt-1">
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
