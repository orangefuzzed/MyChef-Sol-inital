'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  Heart,
  ShoppingCart,
  History,
  ChefHat,
  User,
  LogOut,
  Bookmark,
  CircleX,
} from 'lucide-react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import styles from './HamburgerMenu.module.css';

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ isOpen, onClose }) => {
  const { data: session } = useSession();
  const [userImage, setUserImage] = useState<string | null>(null);
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);

  // Ensure the portal root is available after the component mounts
  useEffect(() => {
    setPortalRoot(document.body); // Set the portal root dynamically
  }, []);

  // Fetch user avatar
  useEffect(() => {
    const fetchUserAvatar = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch('/api/account');
          const data = await response.json();
          if (response.ok && data.account.avatarUrl) {
            setUserImage(data.account.avatarUrl);
          }
        } catch (error) {
          console.error('Error fetching user avatar:', error);
        }
      }
    };
    fetchUserAvatar();
  }, [session]);

  const menuItems = [
    { icon: <ChefHat size={20} color={'#fff'} />, text: 'My Dishcoveries', link: '/MyHome' },
    { icon: <Settings size={20} color={'#fff'}/>, text: 'My Preferences', link: '/preferences' },
    { icon: <Bookmark size={20} color={'#fff'} />, text: 'Saved Recipes', link: '/saved-recipes' },
    { icon: <Heart size={20} color={'#fff'} />, text: 'Favorite Recipes', link: '/favorites' },
    { icon: <ShoppingCart size={20} color={'#fff'} />, text: 'Shopping Lists', link: '/shopping-lists' },
    { icon: <History size={20} color={'#fff'} />, text: 'Recent History', link: '/history' },    
    /*{ icon: <Calendar size={20} color={'#fff'} />, text: 'Saved Meal Plans', link: '/saved-meal-plans' },*/
  ];

  if (!portalRoot) return null; // Prevent rendering until portalRoot is set

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            onClick={onClose} // Close menu on overlay click
          />

          {/* Sliding Menu */}
          <motion.div
            className="fixed top-0 right-0 w-4/5 max-w-sm h-full bg-gray-950 z-50 shadow-lg flex flex-col p-4"
            initial={{ x: '100%' }}
            animate={{ x: '0%' }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-slate-500 hover:text-gray-300 transition"
            >
              <CircleX size={24} />
            </button>

            {/* User Avatar */}
            <div className="flex items-center justify-center mt-4">
              {userImage ? (
                <Image
                  src={userImage}
                  alt="User Avatar"
                  width={60}
                  height={60}
                  className={styles.avatarImage}
                />
              ) : (
                <User size={40} className="text-gray-300" />
              )}
            </div>

            {/* Menu Items */}
            <nav className="flex-grow mt-6 space-y-4">
              {menuItems.map((item) => (
                <Link key={item.text} href={item.link} passHref>
                  <div
                    className="flex items-center space-x-3 p-2 text-gray-200 hover:text-teal-400 cursor-pointer transition"
                    onClick={onClose}
                  >
                    {item.icon}
                    <span className="text-md">{item.text}</span>
                  </div>
                </Link>
              ))}
            </nav>

            {/* Divider */}
            <div className="my-4 border-t border-gray-600"></div>

            {/* Account & Sign Out */}
            <div className="space-y-4">
              <Link href="/account" passHref>
                <div
                  className="flex items-center space-x-3 text-gray-200 hover:text-teal-400 cursor-pointer transition"
                  onClick={onClose}
                >
                  <User size={20} />
                  <span>Profile & Account Settings</span>
                </div>
              </Link>
              <div
                className="flex items-center space-x-3 text-gray-200 hover:text-teal-400 cursor-pointer transition"
                onClick={async () => {
                  try {
                    await signOut({ callbackUrl: '/login' });
                  } catch (error) {
                    console.error('Error during sign out:', error);
                  } finally {
                    onClose();
                  }
                }}
              >
                <LogOut size={20} />
                <span>Sign Out</span>
              </div>
            </div>

            {/* Divider */}
            <div className="my-4 border-t border-gray-600"></div>

            {/* Logo */}
            <div className="flex items-center justify-center mt-2 mb-4">
              <img src="/images/dishcovery-full-logo.png" alt="Dishcovery" className="w-3/4" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    portalRoot
  );
};

export default HamburgerMenu;
