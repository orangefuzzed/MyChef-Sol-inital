import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  Heart,
  ShoppingCart,
  History,
  Calendar,
  User,
  LogOut,
  Bookmark
} from 'lucide-react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import axios from 'axios';
import styles from './HamburgerMenu.module.css';

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ isOpen, onClose }) => {
  const { data: session } = useSession();
  const [userImage, setUserImage] = useState<string | null>(null);

  // Fetch user's avatar URL from the API endpoint
  useEffect(() => {
    const fetchUserAvatar = async () => {
      if (session?.user?.email) {
        try {
          const response = await axios.get('/api/account'); // This endpoint will handle fetching from the DB
          if (response.status === 200) {
            const account = response.data.account;
            if (account.avatarUrl) {
              setUserImage(account.avatarUrl);
            }
          }
        } catch (error) {
          console.error('Failed to fetch user avatar:', error);
        }
      }
    };

    fetchUserAvatar();
  }, [session]);

  const menuItems = [
    { icon: <Settings size={20} />, text: 'Preferences', link: '/preferences' },
    { icon: <Bookmark size={20} />, text: 'Saved Recipes', link: '/saved-recipes' },
    { icon: <Heart size={20} />, text: 'Favorites', link: '/favorites' },
    { icon: <ShoppingCart size={20} />, text: 'Shopping Lists', link: '/shopping-lists' },
    { icon: <History size={20} />, text: 'Recent History', link: '/history' },
    { icon: <Calendar size={20} />, text: 'Saved Meal Plans', link: '/saved-meal-plans' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className={styles.menuContainer}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* User Avatar */}
            <div className={styles.avatar}>
              {userImage ? (
                <Image
                  src={userImage}
                  alt="User Avatar"
                  width={60}
                  height={60}
                  className={styles.avatarImage}
                />
              ) : (
                <User size={40} />
              )}
            </div>

            {/* Main Menu Items */}
            {menuItems.map((item, index) => (
              <Link key={index} href={item.link} passHref>
                <div className={styles.menuItem} onClick={onClose}>
                  {item.icon}
                  <span>{item.text}</span>
                </div>
              </Link>
            ))}

            {/* Divider */}
            <div className={styles.divider}></div>

            {/* Account and Sign Out */}
            <Link href="/account" passHref>
              <div className={styles.menuItem} onClick={onClose}>
                <User size={20} />
                <span>Account</span>
              </div>
            </Link>
            <div className={styles.menuItem} onClick={async () => {
              try {
                await signOut({ callbackUrl: '/login' });
              } catch (error) {
                console.error("Error during sign out:", error);
              } finally {
                onClose();
              }
            }}>
              <LogOut size={20} />
              <span>Sign Out</span>
            </div>

            {/* Dark/Light Mode Toggle */}
            <div className={styles.menuItem}>
              <span>Dark/Light Mode</span>
              <div className={styles.toggleSwitch}>
                <div className={styles.toggleButton} />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default HamburgerMenu;
