'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import * as Checkbox from '@radix-ui/react-checkbox';
import { Check, Search, CircleX } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation'; // Importing Next.js router

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
  setQuery: (value: string) => void;
  options: string[];
  setOptions: (value: string[]) => void;
  onSearch: () => void;
}


const searchOptions = [
  { id: 'myStuff', label: 'Search My Stuff' },
  { id: 'prompts', label: 'Search Prompts' },
  { id: 'recipes', label: 'Search Dishcovery Recipes' },
];

const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  query,
  setQuery,
  options,
  setOptions,
  onSearch,
}) => {

  const router = useRouter(); // Next.js router for default navigation

  const handleSearch = () => {
    onClose(); // Close the modal
    router.push(`/search-results?query=${encodeURIComponent(query)}&options=${JSON.stringify(options)}`);
  };

  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalRoot(document.body);
  }, []);

  const handleCheckboxChange = (id: string, checked: boolean) => {
    if (checked) {
      setOptions([...options, id]);
    } else {
      setOptions(options.filter((option) => option !== id));
    }
  };

  if (!portalRoot) return null; // Prevent rendering until portalRoot is available

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Modal */}
            <motion.div
              className="bg-slate-950/80 backdrop-blur-lg border border-gray-400 shadow-lg rounded-2xl w-[90%] max-w-lg p-6 relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              role="dialog"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-2 right-2 rounded-full bg-pink-800 transition z-10"
                aria-label="Close modal"
              >
                <CircleX className="w-5 h-5 text-sky-50" />
              </button>

              {/* Modal Header */}
              <h2 className="text-xl text-sky-50 font-bold mb-4 text-center">
                Search Dishcovery
              </h2>

              {/* Search Input */}
              <div className="mb-6">
                <label
                  htmlFor="search-query"
                  className="block text-gray-300 text-sm mb-2"
                >
                  Enter your search query:
                </label>
                <input
                  id="search-query"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search recipes, categories, or prompts..."
                  className="w-full p-2 rounded-lg bg-gray-800 text-sky-50 text-sm border border-gray-600 focus:outline-none focus:ring focus:ring-[#00a39e]"
                />
              </div>

              {/* Search Options */}
              <div className="mb-6">
                <label className="block text-gray-300 text-sm mb-2">
                  What would you like to search?
                </label>
                <div className="space-y-3">
                  {searchOptions.map((option) => (
                    <div
                      key={option.id}
                      className="flex items-center space-x-4 text-gray-300"
                    >
                      <Checkbox.Root
                        id={option.id}
                        checked={options.includes(option.id)}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange(option.id, !!checked)
                        }
                        className="mb-2 w-5 h-5 bg-gray-700 rounded-md flex items-center justify-center border border-gray-500"
                      >
                        <Checkbox.Indicator>
                          <Check className="w-4 h-4 text-[#00a39e]" />
                        </Checkbox.Indicator>
                      </Checkbox.Root>
                      <label htmlFor={option.id} className="text-gray-300">
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Search Button */}
              <div className="text-center">
                <button
                  onClick={handleSearch} // Hooked up here!
                  className="mb-4 flex items-center justify-center w-full mt-4 p-2 px-6 bg-[#00a39e]/50 border border-sky-50 shadow-lg ring-1 ring-black/5 rounded-full text-sky-50 gap-2"
                >
                  Search
                  <Search strokeWidth={1.5} className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    portalRoot
  );
};

export default SearchModal;

