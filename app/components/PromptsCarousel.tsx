'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { SendHorizontal } from 'lucide-react';
import { Prompt } from '../../types/Prompt';

interface PromptsCarouselProps {
    prompts: Prompt[]; // Expect a list of prompts as a prop
    onRefresh: () => void; // Add a refresh handler as a prop
  }

interface PromptsCarouselProps {
  prompts: Prompt[];
  onRefresh: () => void;
}

const PromptsCarousel: React.FC<PromptsCarouselProps> = ({ prompts, onRefresh }) => {
    const router = useRouter();
  
    const handlePromptClick = (prompt: string) => {
      // Redirect to chat interface and pre-fill input field with selected prompt
      router.push(`/ai-chat?prompt=${encodeURIComponent(prompt)}`);
    };

  return (
    <div>
      {/*<div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <h2 className="text-xl font-light text-sky-50">Recent Prompts</h2>
        </div>
         Refresh Button 
        <button
          onClick={onRefresh}
          className="flex items-center bg-sky-50/30 hover:bg-sky-50/40 text-pink-800 px-3 py-1 rounded-md shadow-md transition ml-6"
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          Refresh
        </button>
      </div>*/}
      <div className="flex gap-6 overflow-x-auto scrollbar-hide">
        {prompts.length > 0 ? (
          prompts.map((prompt, index) => (
            <div
              key={index}
              className="w-64 bg-white/30 backdrop-blur-lg border-white border shadow-lg ring-1 ring-black/5 px-6 pt-6 pb-4 rounded-2xl flex-shrink-0 cursor-pointer hover:shadow-xl transition"
              onClick={() => handlePromptClick(prompt.text)}
            >
              <p className="text-sm text-sky-50">{prompt.text}</p>
              {/*<span className="text-xs text-gray-400 block mt-2">{new Date(prompt.timestamp).toLocaleString()}</span>*/}
              {/* Use Prompt Button */}
              <button
                onClick={() => handlePromptClick(prompt.text)}
                className="mt-6 p-2 px-6 bg-pink-800/50 border border-sky-50 shadow-lg ring-1 ring-black/5 rounded-full text-sm  text-sky-50 flex items-center gap-2"
              >
                Use Prompt
                <SendHorizontal strokeWidth={1.5} className="w-5 h-5" />
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center">No recent prompts found.</p>
        )}
      </div>
    </div>
  );
};

export default PromptsCarousel;
