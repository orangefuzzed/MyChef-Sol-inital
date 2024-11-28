'use client';

import React, { useState, useEffect } from 'react';
import { Text } from '@radix-ui/themes';
import Image from 'next/image';
import { Bot, ArrowLeft } from 'lucide-react'; // Importing icons
import HamburgerMenu from './HamburgerMenu';
import styles from './Header.module.css';
import axios from 'axios';

interface HeaderProps {
  centralText: string;
  onBackClick?: () => void; // Add optional onBackClick prop for back button handling
  backButton?: {
    label?: string; // Optional label for the back button
    icon?: JSX.Element; // Optional icon for the back button
    onClick?: () => void; // Optional custom click handler for the back button
  };
}

const Header: React.FC<HeaderProps> = ({ centralText, onBackClick, backButton }) => {
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
        {/* Back Button (if onBackClick or backButton is provided) */}
        {(onBackClick || backButton) && (
          <button
            onClick={backButton?.onClick || onBackClick}
            className={`${styles.backButton} text-white hover:text-gray-400`}
          >
            {backButton?.icon || <ArrowLeft size={24} className="mr-2" />}
            {backButton?.label || 'Back'}
          </button>
        )}

        {/* Hamburger Menu Button (if no back button is provided) */}
        {!onBackClick && !backButton && (
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
          {/* <span className="text-lg font-semibold">{centralText}</span>*/}
        </div>

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
