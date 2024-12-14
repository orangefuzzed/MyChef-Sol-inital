'use client';

import React, { useState, useEffect } from 'react';
import { Text } from '@radix-ui/themes';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // Importing Next.js router
import { Menu, CircleArrowLeft } from 'lucide-react'; // Importing icons
import HamburgerMenu from './HamburgerMenu';
import styles from './Header.module.css';
import axios from 'axios';

interface HeaderProps {
  centralText: string;
  onBackClick?: () => void; // Optional custom back button handler
}

const Header: React.FC<HeaderProps> = ({ onBackClick }) => {
  const [user, setUser] = useState<{ displayName: string; avatarUrl?: string } | null>(null);
  const [isHamburgerMenuOpen, setIsHamburgerMenuOpen] = useState(false);
  const router = useRouter(); // Next.js router for default navigation

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

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick(); // Use the custom handler if provided
    } else {
      router.back(); // Default behavior: navigate back in history
    }
  };

  return (
    <header className={`${styles.header} header`}>
      <div className="flex justify-between items-center py-1.5 px-4 bg-black/75 border-b border-gray-800 text-white backdrop-blur-lg shadow-lg ring-1 ring-black/5">
        {/* Back Button */}
        <button
          onClick={handleBackClick}
          className={`${styles.backButton} text-white`}
        >
          <CircleArrowLeft strokeWidth={1.5} size={24} />
        </button>

        {/* Central Greeting */}
        <div className="flex items-center gap-2">
          <Image
            src="/images/kAi.png"
            alt="Food Bot"
            width={30}
            height={30}
            className="rounded-full"
          />
          <Text className="text-md text-white">
            Hiya, {user ? user.displayName || 'Guest' : 'Guest'}!
          </Text>
        </div>

        {/* Menu Button */}
        <button
          className={`${styles.menuButton}`}
          onClick={() => setIsHamburgerMenuOpen(!isHamburgerMenuOpen)}
        >
          <Menu strokeWidth={1.5} size={24} className="text-white" />
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
