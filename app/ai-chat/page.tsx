// /app/ai-chat/page.tsx

'use client';

import React from 'react';
import AIChatInterface from '../components/AIChatInterface'; // Adjust the path if needed

const AIChatPage: React.FC = () => {
  return (
    <div className="h-screen flex flex-col #00a39e text-white overflow-hidden">
      <AIChatInterface />
    </div>
  );
};

export default AIChatPage;
