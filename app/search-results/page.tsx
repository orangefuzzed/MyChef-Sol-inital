'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { RecipeCategoryDocument } from '@/types/RecipeCategoryDocument';
import { Recipe } from '@/types/Recipe';
import { Prompt } from '@/types/Prompt'; // Import Prompt type
import { Search, SendHorizontal } from 'lucide-react';

const SearchResultsPage: React.FC = () => {
  const [recipes, setRecipes] = useState<(RecipeCategoryDocument & Recipe)[]>([]);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const fetchResults = async () => {
      const query = searchParams?.get('query') || ''; // Safely handle `searchParams`
      const options = searchParams?.get('options') || '[]';
  
      try {
        const response = await fetch(`/api/search?query=${encodeURIComponent(query)}&options=${options}`);
        if (response.ok) {
          const data = await response.json();
  
          // Separate and sort recipes and prompts
          const recipeResults = data
            .filter((item: any) => item.recipeTitle) // Items with recipeTitle
            .sort((a: any, b: any) => a.recipeTitle.localeCompare(b.recipeTitle)); // Sort alphabetically
  
          const promptResults = data
            .filter((item: any) => item.text) // Items with text for prompts
            .sort((a: any, b: any) => a.text.localeCompare(b.text)); // Sort alphabetically
  
          setRecipes(recipeResults);
          setPrompts(promptResults);
        } else {
          console.error('Error fetching search results:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    };
  
    fetchResults();
  }, [searchParams]);
  

  const handleRecipeClick = (id: string) => {
    router.push(`/recipe-view?id=${id}`);
  };

  const handlePromptClick = (prompt: string) => {
    router.push(`/ai-chat?prompt=${encodeURIComponent(prompt)}`);
  };

  return (
    <div
      className="flex flex-col h-screen bg-fixed bg-cover bg-center text-white"
      style={{ backgroundImage: "url('/images/porch-dinner-2.png')" }}
    >
      <Header centralText="Search Results" />

      <div className="flex-grow overflow-y-auto p-6">
        {recipes.length > 0 && (
          <>
            <h2 className="text-lg font-bold text-sky-50 mb-4">Recipes Search Results</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {recipes.map((result, index) => (
                <div
                  key={index}
                  className="bg-white/30 backdrop-blur-lg border-white border shadow-lg ring-1 ring-black/5 p-4 rounded-2xl cursor-pointer hover:shadow-2xl transition"
                  onClick={() => handleRecipeClick(result.id)}
                >
                  {/* Icon */}
                  <div className="flex items-center text-sm text-sky-50 mb-2">
                    <Search className="text-sky-50 bg-[#00a39e]/60 w-7 h-7 p-1 mr-2 border border-white rounded-full" />

                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-sky-50 mb-3">
                    {result.recipeTitle || 'Untitled Recipe'}
                  </h3>

                  {/* Description */}
                  <div className="flex items-center text-xs text-slate-950">
                    <span>{result.description || 'No description available'}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {prompts.length > 0 && (
          <>
            <h2 className="text-lg font-bold text-sky-50 mt-8 mb-4">Prompts Search Results</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {prompts.map((prompt, index) => (
                <div
                  key={index}
                  className="bg-white/30 backdrop-blur-lg border-white border shadow-lg ring-1 ring-black/5 p-4 rounded-2xl cursor-pointer hover:shadow-xl transition"
                >
                  <p className="text-sm text-sky-50">{prompt.text}</p>
                  
                  {/* Use Prompt Button */}
                  <button
                    onClick={() => handlePromptClick(prompt.text)}
                    className="mt-6 p-2 px-6 bg-pink-800/50 border border-sky-50 shadow-lg ring-1 ring-black/5 rounded-full text-sm text-sky-50 flex items-center gap-2"
                  >
                    Use Prompt
                    <SendHorizontal strokeWidth={1.5} className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {recipes.length === 0 && prompts.length === 0 && (
          <div className="text-center text-gray-400">
            No results found. Try adjusting your search!
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer actions={['home', 'send']} />
    </div>
  );
};

export default SearchResultsPage;
