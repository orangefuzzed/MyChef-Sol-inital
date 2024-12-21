'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import HamburgerMenu from '../components/HamburgerMenu';
import AvatarMenu from '../components/AvatarMenu';
import Footer from '../components/Footer';
import Header from '../components/Header'; // Import the Header component
import SavedRecipesCarousel from '../components/SavedRecipesCarousel';
import FavoriteRecipesCarousel from '../components/SavedRecipesCarousel';
import ShoppingListsCarousel from '../components/ShoppingListsCarousel';
import GetStartedModal from './GetStartedModal';


const HomeScreen: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isHamburgerMenuOpen, setIsHamburgerMenuOpen] = useState(false);
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
  const [activeModalIndex, setActiveModalIndex] = useState<number | null>(null);

  const dummyWalkthroughCards = [
    {
      title: "Discover Recipes in a Snap!",
      description: "Find your next favorite recipe in seconds.",
      modalContent: "Use Dishcovery's AI to find personalized recipes tailored to your taste and dietary needs.",
      imageSrc: "/images/kAi.png", // Example image
    },
    {
      title: "Save Your Favorites",
      description: "Keep track of recipes you love.",
      modalContent: "Never lose track of your favorite meals. Save recipes to revisit later and share them with friends!",
      imageSrc: "/images/favorites.png", // Example image
    },
    {
      title: "Plan Your Meals",
      description: "Make meal planning a breeze.",
      modalContent: "Create shopping lists and plan your meals for the week—all in one app.",
      imageSrc: "/images/shopping-list.png", // Example image
    },
    {
      title: "Cook Mode Activated!",
      description: "Follow step-by-step instructions.",
      modalContent: "Dishcovery's Cook Mode lets you focus on cooking with step-by-step instructions and voice guidance.",
      imageSrc: "/images/cook-mode.png", // Example image
    },
    {
      title: "Write the Perfect Prompt",
      description: "Get the most out of Dishcovery.",
      modalContent: "Learn to write creative prompts like 'Quick and easy dinner ideas' or 'High-protein breakfasts.' Dishcovery will take it from there!",
      imageSrc: "/images/prompts.png", // Example image
    },
  ];
  


  // Redirect to login page if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  return (
    <div
      className="flex flex-col overflow-y-auto h-screen bg-fixed bg-cover bg-center text-white"
      style={{ backgroundImage: "url('/images/summer-deck-5.png')" }}
    >
      {/* Header */}
      <Header centralText={`Welcome, ${session?.user?.name || 'Guest'}`} />

      {/* Menus */}
      <HamburgerMenu isOpen={isHamburgerMenuOpen} onClose={() => setIsHamburgerMenuOpen(false)} />
      <AvatarMenu isOpen={isAvatarMenuOpen} onClose={() => setIsAvatarMenuOpen(false)} />

      {/* Walkthrough Section */}
        <div className="px-6 py-4">
          <h2 className="text-2xl font-bold text-sky-50 mb-4">Get Started</h2>
          <div className="flex gap-4 overflow-x-auto">
            {dummyWalkthroughCards.map((card, index) => (
              <div
                key={index}
                className="min-w-[300px] bg-white/30 backdrop-blur-lg border border-white shadow-lg rounded-2xl p-6 flex-shrink-0 cursor-pointer hover:shadow-2xl transition"
                onClick={() => setActiveModalIndex(index)} // Open the modal for this card
              >
                <h3 className="text-lg font-bold mb-2">{card.title}</h3>
                <p className="text-sm">{card.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Render Modals */}
        {dummyWalkthroughCards.map((card, index) => (
          <GetStartedModal
            key={index}
            isOpen={activeModalIndex === index} // Show the modal only if it's the active card
            onClose={() => setActiveModalIndex(null)} // Close modal when dismissed
            title={card.title}
            content={card.modalContent}
            imageSrc={card.imageSrc}
          />
        ))}


      {/* Saved Recipes */}
      <div className="px-6 py-4">
        <h2 className="text-2xl font-bold text-sky-50 mb-4">My Saved Recipes</h2>
        <div className="flex gap-4 overflow-x-auto">
          <SavedRecipesCarousel />
        </div>
      </div>

      {/* Favorites Section */}
      <div className="px-6 py-4">
        <h2 className="text-2xl font-bold text-sky-50 mb-4">My Favorites</h2>
        <div className="flex gap-4 overflow-x-auto">
          <FavoriteRecipesCarousel />
        </div>
      </div>

      {/* Shopping Lists Section */}
      <div className="px-6 py-4">
        <h2 className="text-2xl font-bold text-sky-50 mb-4">My Shopping Lists</h2>
        <div className="flex gap-4 overflow-x-auto">
          <ShoppingListsCarousel />
        </div>
      </div>

      {/* Footer */}
      <Footer actions={['home', 'send']} />
    </div>
  );
};

export default HomeScreen;
