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
    save: { icon: <Bookmark size={24} />, label: 'Save', link: '/saved-recipes' },
    favorite: { icon: <Heart size={24} />, label: 'Favorite', link: '/favorites' },
    send: { icon: <Send size={24} />, label: 'Send', link: '/ai-chat' },
  };

  return (
    <footer className={`${styles.footer} footer`}>
      <div className={`${styles.footerContainer} p-4 border-t border-gray-700 border-solid border-[1px]`}>
        {/* Static Actions */}
        {actions.map((action, index) => {
          const item = actionItems[action];
          return (
            <Link key={index} href={item.link} passHref>
              <div className={styles.footerItem}>
                {item.icon}
                <span>{item.label}</span>
              </div>
            </Link>
          );
        })}

        {/* Contextual Actions */}
        {contextualActions && contextualActions.length > 0 && (
          <div className={`${styles.contextualActions} flex gap-4 mt-2`}>
            {contextualActions.map((action, index) => (
              <button key={index} onClick={action.onClick} className="p-2 bg-gray-700 rounded-full text-white">
                {action.icon}
                <span className="ml-2">{action.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </footer>
  );
};

export default Footer;
