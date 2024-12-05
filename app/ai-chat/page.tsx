// /app/ai-chat/page.tsx

'use client';

import React from 'react';
import AIChatInterface from '../components/AIChatInterface'; // Adjust the path if needed

const AIChatPage: React.FC = () => {
  return (
    <div className="h-screen flex flex-col bg-green-900 text-white overflow-hidden">
      <AIChatInterface />
    </div>
  );
};

export default AIChatPage;
