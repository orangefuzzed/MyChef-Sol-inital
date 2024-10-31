'use client';

import React, { useEffect, useState } from 'react';
import { useRecipeContext } from './../contexts/RecipeContext';
import ReactMarkdown from 'react-markdown';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ArrowLeftCircle } from 'lucide-react'; // Import back icon

const CookModePage = () => {
  const { selectedRecipe } = useRecipeContext();
  const router = useRouter();
  const [hydrationReady, setHydrationReady] = useState(false);

  useEffect(() => {
    // Set hydration state to true once component mounts to avoid hydration issues
    setHydrationReady(true);
  }, []);

  if (!hydrationReady) {
    return null; // Prevent rendering until hydration is ready
  }

  if (!selectedRecipe) {
    return (
      <div className="h-screen flex flex-col bg-gray-900 text-white overflow-hidden">
        {/* Header with contextual Back Button */}
        <Header
          centralText="Cook Mode"
          backButton={{
            label: 'Back to Recipe',
            icon: <ArrowLeftCircle size={24} />,
            onClick: () => router.push('/recipe-view'),
          }}
        />

        {/* Main Content */}
        <div className="flex-grow p-8 overflow-y-auto">
          <p>No recipe selected. Please go back and select a recipe.</p>
          <button
            onClick={() => router.push('/recipe-view')}
            className="mt-4 p-2 bg-blue-500 rounded-full text-white"
          >
            Go Back to Recipe Selection
          </button>
        </div>

        {/* Footer with standard actions */}
        <Footer actions={['home', 'save', 'favorite', 'send']} />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white overflow-hidden">
      {/* Header with contextual Back Button */}
      <Header
        centralText={`Cook Mode: ${selectedRecipe.title}`}
        backButton={{
          label: 'Back to Recipe',
          icon: <ArrowLeftCircle size={24} />,
          onClick: () => router.push('/recipe-view'),
        }}
      />

      {/* Main Content */}
      <div className="flex-grow p-8 overflow-y-auto">
        <h2 className="text-4xl font-bold mb-4">Cook Mode: {selectedRecipe.title}</h2>
        <ReactMarkdown>{selectedRecipe.instructions.join('\n')}</ReactMarkdown>
      </div>

      {/* Footer with standard actions */}
      <Footer actions={['home', 'save', 'favorite', 'send']} />
    </div>
  );
};

export default CookModePage;
