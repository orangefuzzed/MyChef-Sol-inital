'use client';

import React, { useState, useEffect } from 'react';
import { Text } from '@radix-ui/themes';
import Image from 'next/image';
import { Menu, ArrowLeft } from 'lucide-react'; // Importing icons
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
      <div className="flex justify-between items-center p-2 bg-white/30 backdrop-blur-lg shadow-lg ring-1 ring-black/5">
        {/* Help Icon (moved to the upper-left corner) */}
        {!onBackClick && !backButton && (
          <button className={`${styles.helpButton}`}>
            <Image
              src="/images/food-bot-1.png"
              alt="Help"
              width={30}
              height={30}
              className="rounded-full"
            />
          </button>
        )}

        {/* Back Button (if onBackClick or backButton is provided) */}
        {(onBackClick || backButton) && (
          <button
            onClick={backButton?.onClick || onBackClick}
            className={`${styles.backButton} text-black hover:text-gray-600`}
          >
            {backButton?.icon || <ArrowLeft size={24} className="mr-2" />}
            {backButton?.label || ''}
          </button>
        )}

        {/* Central Text Area */}
        <div className="flex flex-col items-center">
          <Text className={styles.greeting}>
            {getTimeBasedGreeting()}, {user ? user.displayName || 'Guest' : 'Guest'}
          </Text>
          <span className="text-lg text-black font-semibold">{centralText}</span>
        </div>

        {/* Menu Button (moved to the upper-right corner) */}
        <button
          className={`${styles.menuButton}`}
          onClick={() => setIsHamburgerMenuOpen(!isHamburgerMenuOpen)}
        >
          <Menu size={28} strokeWidth={1} className="text-black" />
        </button>

        {/* Hamburger Menu */}
        <HamburgerMenu
          isOpen={isHamburgerMenuOpen}
          onClose={() => setIsHamburgerMenuOpen(false)}
        />
      </div>
    </header>
  );
};

export default Header;
