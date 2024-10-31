import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings, CreditCard, HelpCircle, LogOut } from 'lucide-react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import axios from 'axios';
import styles from './AvatarMenu.module.css';

interface AvatarMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const AvatarMenu: React.FC<AvatarMenuProps> = ({ isOpen, onClose }) => {
  const { data: session } = useSession();
  const [userImage, setUserImage] = useState<string | null>(null);

  // Fetch user's avatar URL from the MongoDB
  useEffect(() => {
    const fetchUserAvatar = async () => {
      if (session?.user?.email) {
        try {
          const response = await axios.get('/api/account');
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
    { icon: <User size={20} />, text: 'Profile', link: '/profile' },
    { icon: <Settings size={20} />, text: 'Settings', link: '/settings' },
    { icon: <CreditCard size={20} />, text: 'Account', link: '/account' },
    { icon: <HelpCircle size={20} />, text: 'Help', link: '/help' },
  ];

  const handleSignOut = async () => {
    try {
      await signOut({
        callbackUrl: '/login', // Redirect users to login page after logging out
      });
    } catch (error) {
      console.error("Error during sign out:", error);
    } finally {
      onClose();
    }
  };

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
            {menuItems.map((item, index) => (
              <Link key={index} href={item.link} passHref>
                <div className={styles.menuItem} onClick={onClose}>
                  {item.icon}
                  <span>{item.text}</span>
                </div>
              </Link>
            ))}
            <div className={styles.menuItem} onClick={handleSignOut}>
              <LogOut size={20} />
              <span>Sign Out</span>
            </div>
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

export default AvatarMenu;
