'use client';

import React, { useState, useEffect } from 'react';
import { Text } from '@radix-ui/themes';
import Image from 'next/image';
import { Bot } from 'lucide-react'; // Importing icons
import HamburgerMenu from './HamburgerMenu';
import styles from './Header.module.css';
import axios from 'axios';

interface HeaderProps {
  centralText: string;
  backButton?: {
    label: string;
    icon: JSX.Element;
    onClick: () => void;
  };
}

const Header: React.FC<HeaderProps> = ({ backButton }) => {
  const [user, setUser] = useState<{ displayName: string; avatarUrl?: string } | null>(null);
  const [isHamburgerMenuOpen, setIsHamburgerMenuOpen] = useState(false);

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

  const getTimeBasedGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      return 'Good morning';
    } else if (currentHour < 18) {
      return 'Good afternoon';
    } else {
      return 'Good evening';
    }
  };

  return (
    <header className={`${styles.header} header`}>
      <div className="flex justify-between items-center p-4 border-b border-gray-700 border-solid border-[1px] bg-gray-800">
        {/* Back Button (if provided) */}
        {backButton && (
          <button onClick={backButton.onClick} className={styles.backButton}>
            <div className={styles.backButtonWrapper}>
              {backButton.icon}
              <span className="ml-2">{backButton.label}</span>
            </div>
          </button>
        )}

        {/* Hamburger Menu Button */}
        {!backButton && (
          <button
            className={styles.menuButton}
            onClick={() => setIsHamburgerMenuOpen(!isHamburgerMenuOpen)}
          >
            <div className={styles.menuIconWrapper}>
              <Image
                src="/icons/burger.png"
                alt="Menu"
                width={24}
                height={24}
                className={styles.menuIcon}
              />
            </div>
          </button>
        )}

        {/* Central Text Area */}
        <div className="flex flex-col items-center">
          <Text className={styles.greeting}>
            {getTimeBasedGreeting()}, {user ? user.displayName || 'Guest' : 'Guest'}
          </Text>
        </div>

        {/* Avatar Image (if user is logged in and has an avatar) 
        {user?.avatarUrl && (
          <Image
            src={user.avatarUrl}
            alt="User Avatar"
            width={40}
            height={40}
            className="rounded-full border border-gray-700"
          />
        )}*/}

        {/* Help Icon Button */}
        <button className={styles.helpButton}>
          <div className={styles.menuIconWrapper}>
            <Bot size={28} strokeWidth={1} className={styles.helpIcon} />
          </div>
        </button>

        {/* Menus */}
        <HamburgerMenu
          isOpen={isHamburgerMenuOpen}
          onClose={() => setIsHamburgerMenuOpen(false)}
        />
      </div>
    </header>
  );
};

export default Header;
