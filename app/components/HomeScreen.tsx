'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import styles from './HomeScreen.module.css';
import HamburgerMenu from '../components/HamburgerMenu';
import AvatarMenu from '../components/AvatarMenu';
import Footer from '../components/Footer';
import Header from '../components/Header'; // Import the Header component
import { BotMessageSquare, ChefHat } from 'lucide-react';
import Link from 'next/link'

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


  // The main component content should only be returned once the user is authenticated.
  return (
    
    <div className="flex flex-col h-screen bg-fixed bg-cover bg-center text-white"
      style={{ backgroundImage: "url('/images/summer-deck-5.png')" }}
      >
      {/* Use Header Component for the Top Bar */}
      <Header centralText={`Home - ${session?.user?.name || 'Guest'}`} />

      {/* Menus */}
      <HamburgerMenu isOpen={isHamburgerMenuOpen} onClose={() => setIsHamburgerMenuOpen(false)} />
      <AvatarMenu isOpen={isAvatarMenuOpen} onClose={() => setIsAvatarMenuOpen(false)} />

      {/* Main Content */}
      <div className="flex-grow p-8 overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[{
              icon: 'dish 1' as IconName,
              title: "Recipes in a Snap!",
              description: "Breakfast, lunch, or snack—recipes at the speed of thought.",
              
            },
            {
              icon: 'fire' as IconName,
              title: "Trending Tastes",
              description: "Find the tastiest dishes making waves this week.",
              
            },
            {
              icon: 'chefshat' as IconName,
              title: "Ask me anything!",
              description: "Ask anything culinary and let the surprises begin.",
              
            },
            {
              icon: 'shopping basket' as IconName,
              title: "Your Custom Menu",
              description: "Expertly curated recipes & meal plans based on what you love.",
              
            },
            {
              icon: 'shrimp' as IconName,
              title: "Bite-Sized Bliss",
              description: "Craft the perfect appetizers for any gathering.",
              
            },
            {
              icon: 'scales' as IconName,
              title: "Macro Magic",
              description: "Meals to match your macros for the ultimate balance.",
              
            },
            {
              icon: 'dish 3' as IconName,
              title: "Recipe Radar",
              description: "Find anything, from everyday meals to culinary adventures.",
              
            },
            {
              icon: 'axe' as IconName,
              title: "Cook Like a Pro",
              description: "Sharpen your skills and learn to cook like a pro.",
              
            },
            {
              icon: 'dish 1' as IconName,
              title: "Old School Eats",
              description: "Nostalgic, hearty, and just like home.",
              
            }
          ].map(({ title, description }, index) => (
            <div key={index} className="recipe-details-container bg-white/30 backdrop-blur-lg border-white border shadow-lg ring-1 ring-black/5 p-6 rounded-2xl">
              <div className="bg-sky-50/30 w-8 h-8 border border-white rounded-full flex items-center justify-center">
                  <ChefHat strokeWidth={1.5} className="w-5 h-5 text-black" /> {/* Example icon, you can change this */}
                </div>
              <div className="mt-2">
                <h3 className={styles.cardTitle}>{title}</h3>
                <p className={styles.cardDescription}>{description}</p>
                <Link href="/ai-chat">
                <button className="mt-4 py-2 px-6 bg-pink-800/50 border border-sky-50 shadow-lg ring-1 ring-black/5 rounded-full text-sky-50 flex items-center gap-2">
                  Get Recipes!
                  <BotMessageSquare strokeWidth={1.5} className="w-5 h-5" />
                </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Footer */}
      <Footer actions={["home", "send"]} />
    </div>
  );
};

export default HomeScreen;
