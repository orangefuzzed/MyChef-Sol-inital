import React from 'react';
import Link from 'next/link';
import { Home, Bookmark, Heart, BotMessageSquare } from 'lucide-react';

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
    send: { icon: <BotMessageSquare strokeWidth={1.5} size={20} />, label: 'Get Recipes', link: '/ai-chat' },
  };

  return (
    <footer className="sticky bottom-0 z-10 w-full bg-black/85 border-t border-gray-800 text-white pb-4 pt-1">
      {/* Container for actions */}
      <div className="flex justify-around items-center">
        {/* Static Actions */}
        {actions.map((action, index) => {
          const item = actionItems[action];
          return (
            <Link key={index} href={item.link} passHref>
              <div className="flex flex-col items-center">
                {item.icon}
                <span className="text-xs">{item.label}</span>
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
    </footer>
  );
};

export default Footer;
