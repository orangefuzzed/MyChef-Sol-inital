import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, CircleUserRound, Heart, Bot } from 'lucide-react';
import Image from 'next/image';
import axios from 'axios';
import { Search } from 'lucide-react';
import SearchModal from './SearchModal';


interface FooterProps {
  actions: string[];
  contextualActions?: { label: string; icon: JSX.Element; onClick: () => void }[];
}

const Footer: React.FC<FooterProps> = ({ actions, contextualActions }) => {
  // Define the static action items
  const actionItems: { [key: string]: { icon: JSX.Element; label: string; link: string } } = {
    home: { icon: <Home strokeWidth={1.5} size={18} />, label: 'Home', link: '/' },
    user: { icon: <CircleUserRound strokeWidth={1.5} size={18} />, label: 'Profile', link: '/account' },
    favorite: { icon: <Heart strokeWidth={1.5} size={18} />, label: 'Favorite', link: '/' },
    send: { icon: <Bot strokeWidth={1.5} size={20} />, label: 'Get Recipes', link: '/ai-chat' },
  };

  const router = useRouter(); // Next.js router for default navigation
  const [query, setQuery] = useState(''); // Add state for query
  const [options, setOptions] = useState<string[]>([]); // Add state for search options
  const [isSearchModalOpen, setSearchModalOpen] = useState(false);
  const [user, setUser] = useState<{ displayName: string; avatarUrl?: string } | null>(null);
  const pathname = usePathname();

  const handleSearch = () => {
    // Redirect to search results page with query and options as parameters
    const searchParams = new URLSearchParams();
    searchParams.append('query', query);
    searchParams.append('options', JSON.stringify(options));
    router.push(`/search-results?${searchParams.toString()}`);
    setSearchModalOpen(false); // Close the modal
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/api/account');
        if (response.status === 200) {
          setUser(response.data.account);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <footer className="sticky bottom-0 z-10 w-full bg-black/85 backdrop-blur-lg shadow-lg border-t border-gray-800 text-white pb-4 pt-1">
      {/* Main Footer Content */}
      <div className="flex justify-around items-center relative">

        {/* Static Actions */}
        {actions.map((action, index) => {
          const item = actionItems[action];
          if (!item) return null;
          return (
            <Link key={index} href={item.link} passHref>
              <div className="flex flex-col items-center">
                {item.icon}
                <span className="text-xs mt-1">{item.label}</span>
              </div>
            </Link>
          );
        })}

        {/* Search Button (Conditionally Hidden) */}
        {pathname !== '/ai-chat' && ( // Hide on AI Chat page
          <button
            onClick={() => setSearchModalOpen(true)}
            className="flex flex-col items-center text-sky-50 ml-3 hover:text-pink-500"
          >
            <Search strokeWidth={1.5} size={18} />
            <span className="text-xs mt-1">Search</span>
          </button>
        )}

        {/* Contextual Actions */}
        {contextualActions && contextualActions.length > 0 && (
          <div className="flex justify-center gap-16 -mr-4">
            {contextualActions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className="flex flex-col items-center text-xs"
              >
                {action.icon}
                <span className="text-xs mt-1">{action.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Floating kAi Icon */}
      {actions.includes('send') && (
        <Link href="/ai-chat" passHref>
          <div className="absolute -top-3 mr-1.5 right-1/2 translate-x-1/2 flex items-center justify-center z-20 cursor-pointer">
            <div className="bg-black w-9 h-9 p-1 rounded-full border border-white flex items-center justify-center hover:scale-110 transition-transform">
              <Image
                src="/images/kAi.png"
                alt="Dishcovery Icon"
                width={36}
                height={36}
                className="shadow-lg"
              />
            </div>
          </div>
        </Link>

      )}
      {/* Search Modal */}
      {isSearchModalOpen && (
        <SearchModal
          isOpen={isSearchModalOpen}
          onClose={() => setSearchModalOpen(false)}
          query={query}
          setQuery={setQuery}
          options={options}
          setOptions={setOptions}
          onSearch={handleSearch}
        />
      )}
    </footer>
  );

};

export default Footer;
