import React from 'react';
import Link from 'next/link';
import { Home, Bookmark, Heart, Bot } from 'lucide-react';

interface FooterProps {
  actions: string[];
  contextualActions?: { label: string; icon: JSX.Element; onClick: () => void }[];
}

const Footer: React.FC<FooterProps> = ({ actions, contextualActions }) => {
  // Define the static action items
  const actionItems: { [key: string]: { icon: JSX.Element; label: string; link: string } } = {
    home: { icon: <Home strokeWidth={1.5} size={22} />, label: 'Home', link: '/' },
    save: { icon: <Bookmark strokeWidth={1.5} size={22} />, label: 'Save', link: '/' },
    favorite: { icon: <Heart strokeWidth={1.5} size={22} />, label: 'Favorite', link: '/' },
    send: { icon: <Bot strokeWidth={1.5} size={24} />, label: 'Chat', link: '/ai-chat' },
  };

  return (
    <footer className="sticky bottom-0 z-10 w-full bg-teal-600 text-white">
      {/* Container for actions */}
      <div className="flex justify-around items-center p-2">
        {/* Static Actions */}
        {actions.map((action, index) => {
          const item = actionItems[action];
          return (
            <Link key={index} href={item.link} passHref>
              <div className="flex flex-col items-center">
                {item.icon}
                <span className="text-sm mt-1">{item.label}</span>
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
                className="flex flex-col items-center text-sm"
              >
                {action.icon}
                <span className="text-sm mt-1">{action.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </footer>
  );
};

export default Footer;
