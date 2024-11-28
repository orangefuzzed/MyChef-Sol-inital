// Footer.tsx

import React from 'react';
import Link from 'next/link';
import { Home, Bookmark, Heart, Send } from 'lucide-react';
import styles from './Footer.module.css';

interface FooterProps {
  actions: string[];
  contextualActions?: { label: string; icon: JSX.Element; onClick: () => void }[];
}

const Footer: React.FC<FooterProps> = ({ actions, contextualActions }) => {
  const actionItems: { [key: string]: { icon: JSX.Element; label: string; link: string } } = {
    home: { icon: <Home size={24} />, label: 'Home', link: '/' },
    save: { icon: <Bookmark size={24} />, label: 'Save', link: '/' },
    favorite: { icon: <Heart size={24} />, label: 'Favorite', link: '/' },
    send: { icon: <Send size={24} />, label: 'Send', link: '/ai-chat' },
  };

  return (
    <footer className={`${styles.footer} sticky bottom-0 w-full bg-gray-900 text-white`}>
      <div className={`${styles.footerContainer} flex justify-around items-center p-4 border-t border-gray-700`}>
        {/* Static Actions */}
        {actions.map((action, index) => {
          const item = actionItems[action];
          return (
            <Link key={index} href={item.link} passHref>
              <div className={`${styles.footerItem} flex flex-col items-center`}>
                {item.icon}
                <span className="text-sm mt-1">{item.label}</span>
              </div>
            </Link>
          );
        })}

        {/* Contextual Actions */}
        {contextualActions && contextualActions.length > 0 && (
          <div className={`${styles.contextualActions} flex gap-4`}>
            {contextualActions.map((action, index) => (
              <button key={index} onClick={action.onClick} className="flex items-center p-2 bg-black rounded-full">
                {action.icon}
                <span className="ml-2 text-sm">{action.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </footer>
  );
};

export default Footer;
