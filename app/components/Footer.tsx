import React from 'react';
import Link from 'next/link';
import { Home, Bookmark, Heart, Bot } from 'lucide-react';
import Image from 'next/image';

interface FooterProps {
  actions: string[];
  contextualActions?: { label: string; icon: JSX.Element; onClick: () => void }[];
}

const Footer: React.FC<FooterProps> = ({ actions, contextualActions }) => {
  // Define the static action items
  const actionItems: { [key: string]: { icon: JSX.Element; label: string; link: string } } = {
    home: { icon: <Home strokeWidth={1.5} size={18} />, label: 'Home', link: '/' },
    save: { icon: <Bookmark strokeWidth={1.5} size={18} />, label: 'Save', link: '/' },
    favorite: { icon: <Heart strokeWidth={1.5} size={18} />, label: 'Favorite', link: '/' },
    send: { icon: <Bot strokeWidth={1.5} size={20} />, label: 'Get Recipes', link: '/ai-chat' },
  };

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

        {/* Contextual Actions */}
      {contextualActions && contextualActions.length > 0 && (
          <div className="flex gap-12">
            {contextualActions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className="flex flex-col items-center text-xs"
              >
                {action.icon}
                <span className="text-xs">{action.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
  
      {/* Floating kAi Icon */}
      {actions.includes('send') && (
        <Link href="/ai-chat" passHref>
          <div className="absolute -top-3 mr-1.5 right-1/4 translate-x-1/2 flex items-center justify-center z-20 cursor-pointer">
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
    </footer>
  );
    
};

export default Footer;
