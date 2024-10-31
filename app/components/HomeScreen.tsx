'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { PaperPlaneIcon } from '@radix-ui/react-icons';
import styles from './HomeScreen.module.css';
import HamburgerMenu from '../components/HamburgerMenu';
import AvatarMenu from '../components/AvatarMenu';
import Footer from '../components/Footer';
import Header from '../components/Header'; // Import the Header component

type IconName = 'apple' | 'avocado' | 'axe' | 'beer 1' | 'cake 1' | 'carrot' | 'cheese' | 'cherry' | 'burger' | 'dish 1' | 'cutlery 4' | 'fire' | 'chefshat' | 'shopping basket' | 'shrimp' | 'scales' | 'dish 3';

const HomeScreen: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // State hooks
  const [isHamburgerMenuOpen, setIsHamburgerMenuOpen] = useState(false);
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);

  // Redirect to login page if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div>Loading...</div>; // You can replace this with a loading spinner if preferred
  }

  // The main component content should only be returned once the user is authenticated.
  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Use Header Component for the Top Bar */}
      <Header centralText={`Home - ${session?.user?.name || 'Guest'}`} />

      {/* Menus */}
      <HamburgerMenu isOpen={isHamburgerMenuOpen} onClose={() => setIsHamburgerMenuOpen(false)} />
      <AvatarMenu isOpen={isAvatarMenuOpen} onClose={() => setIsAvatarMenuOpen(false)} />

      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.recipeGrid}>
          {[{
              icon: 'dish 1' as IconName,
              title: "Recipes in a Snap!",
              description: "Breakfast, lunch, or snack—recipes at the speed of thought.",
              bgImage: "/images/food-010.png"
            },
            {
              icon: 'cutlery 4' as IconName,
              title: "Meal Plan Like a Pro",
              description: "A healthy, happy week of meals is just a tap away!",
              bgImage: "/images/food-02.png"
            },
            {
              icon: 'fire' as IconName,
              title: "Trending Tastes",
              description: "Find the tastiest dishes making waves this week.",
              bgImage: "/images/food-03.png"
            },
            {
              icon: 'chefshat' as IconName,
              title: "Ask me anything!",
              description: "Ask anything culinary and let the surprises begin.",
              bgImage: "/images/food-04.png"
            },
            {
              icon: 'shopping basket' as IconName,
              title: "Your Custom Menu",
              description: "Expertly curated recipes & meal plans based on what you love.",
              bgImage: "/images/food-05.png"
            },
            {
              icon: 'shrimp' as IconName,
              title: "Bite-Sized Bliss",
              description: "Craft the perfect appetizers for any gathering.",
              bgImage: "/images/food-06.png"
            },
            {
              icon: 'scales' as IconName,
              title: "Macro Magic",
              description: "Meals to match your macros for the ultimate balance.",
              bgImage: "/images/food-07.png"
            },
            {
              icon: 'dish 3' as IconName,
              title: "Recipe Radar",
              description: "Find anything, from everyday meals to culinary adventures.",
              bgImage: "/images/food-08.png"
            },
            {
              icon: 'axe' as IconName,
              title: "Cook Like a Pro",
              description: "Sharpen your skills and learn to cook like a pro.",
              bgImage: "/images/food-09.png"
            },
            {
              icon: 'dish 1' as IconName,
              title: "Old School Eats",
              description: "Nostalgic, hearty, and just like home.",
              bgImage: "/images/food-11.png"
            }
          ].map(({ icon, title, description, bgImage }, index) => (
            <div key={index} className={styles.recipeCard}>
              <div className={styles.cardContent}>
                <img
                  src={`/icons/${icon}.png`}
                  width={24}
                  height={24}
                  alt={icon}
                  className={styles.pngCardIcon}
                />
                <h3 className={styles.cardTitle}>{title}</h3>
                <p className={styles.cardDescription}>{description}</p>
                <div className={styles.cardImage} style={{ backgroundImage: `url(${bgImage})` }} />
                <button className={styles.generateButton}>
                  Generate
                  <PaperPlaneIcon className={styles.generateIcon} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Footer */}
      <Footer actions={["home", "save", "favorite", "send"]} />
    </div>
  );
};

export default HomeScreen;
