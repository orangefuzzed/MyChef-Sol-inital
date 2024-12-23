'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import HamburgerMenu from '../components/HamburgerMenu';
import AvatarMenu from '../components/AvatarMenu';
import Footer from '../components/Footer';
import Header from '../components/Header'; // Import the Header component
import SavedRecipesCarousel from '../components/SavedRecipesCarousel';
import ShoppingListsCarousel from '../components/ShoppingListsCarousel';
import GetStartedModal from './GetStartedModal';
import { ShoppingCart, Bookmark, Heart, ChefHat, ExternalLink } from 'lucide-react';
import FavoriteRecipesCarousel from '../components/FavoriteRecipesCarousel';
import { getFavoriteRecipesFromDB } from '../utils/favoritesUtils';
import { Recipe } from '../../types/Recipe';
import { getAllSavedShoppingListsFromDB } from '../utils/shoppingListUtils';
import { ShoppingList } from '../../types/ShoppingList';
import { getSavedRecipesFromDB } from '../utils/indexedDBUtils'; // Assuming we fetch saved recipes here


const HomeScreen: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isHamburgerMenuOpen, setIsHamburgerMenuOpen] = useState(false);
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
  const [activeModalIndex, setActiveModalIndex] = useState<number | null>(null);
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        // Fetch updated favorites from IndexedDB
        const localFavorites = await getFavoriteRecipesFromDB();
        setFavoriteRecipes(localFavorites);
      } catch (error) {
        console.error('Error fetching favorites from IndexedDB:', error);
      }
    };

    const fetchShoppingLists = async () => {
      try {
        // Fetch updated shopping lists from IndexedDB
        const localShoppingLists = (await getAllSavedShoppingListsFromDB()) || []; // Default to an empty array if null
        setShoppingLists(localShoppingLists);
      } catch (error) {
        console.error('Error fetching shopping lists from IndexedDB:', error);
      }
    };

    fetchFavorites();
    fetchShoppingLists();
  }, []);

  useEffect(() => {
    const fetchSavedRecipes = async () => {
      try {
        const localSavedRecipes = (await getSavedRecipesFromDB()) || []; // Default to an empty array if null
        setSavedRecipes(localSavedRecipes);
      } catch (error) {
        console.error('Error fetching saved recipes from IndexedDB:', error);
      }
    };

    fetchSavedRecipes();
  }, []);

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
      imageSrc: "/images/steak-dinner-1.png", // Example image
    },
    {
      title: "Plan Your Meals",
      description: "Make meal planning a breeze.",
      modalContent: "Create shopping lists and plan your meals for the week—all in one app.",
      imageSrc: "/images/pizza-1.png", // Example image
    },
    {
      title: "Cook Mode Activated!",
      description: "Follow step-by-step instructions.",
      modalContent: "Dishcovery's Cook Mode lets you focus on cooking with step-by-step instructions and voice guidance.",
      imageSrc: "/images/man-kids-cooking-4.png", // Example image
    },
    {
      title: "Write the Perfect Prompt",
      description: "Get the most out of Dishcovery.",
      modalContent: "Learn to write creative prompts like 'Quick and easy dinner ideas' or 'High-protein breakfasts.' Dishcovery will take it from there!",
      imageSrc: "/images/breakfast-1.png", // Example image
    },
  ];
  


  // Redirect to login page if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  return (
    <div className="flex flex-col h-screen bg-fixed bg-cover bg-center text-white"
        style={{ backgroundImage: "url('/images/meal-cooking-1.png')" }}
        >
      <Header centralText={`Welcome, ${session?.user?.name || 'Guest'}`} />
      
  
      {/* Menus */}
      <HamburgerMenu isOpen={isHamburgerMenuOpen} onClose={() => setIsHamburgerMenuOpen(false)} />
      <AvatarMenu isOpen={isAvatarMenuOpen} onClose={() => setIsAvatarMenuOpen(false)} />
  
      {/* Main Content */}
      <div className="flex-grow overflow-y-auto px-6 py-4">
        {/* Walkthrough Section */}
        <div className="mb-6">
        <div className="flex items-center mb-4">
            <ChefHat strokeWidth={1.5} className="w-6 h-6 text-pink-800 mr-2" />
            <p className="text-xl font-light text-sky-50">Get Started!</p>
          </div>
          <div className="flex gap-4 overflow-x-auto">
            {dummyWalkthroughCards.map((card, index) => (
              <div
                key={index}
                className="w-80 bg-white/30 backdrop-blur-lg border border-white shadow-lg rounded-2xl p-6 flex-shrink-0 cursor-pointer hover:shadow-2xl transition"
                onClick={() => setActiveModalIndex(index)} // Open the modal for this card
              >
                <div className="bg-sky-50/30 w-8 h-8 border border-white rounded-full flex items-center justify-center mb-2">
                  <ExternalLink strokeWidth={1.5} className="w-4 h-4 text-black" />
                </div>
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
  
        {/* Favorites Section */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <Heart strokeWidth={1.5} className="w-6 h-6 text-pink-800 mr-2" />
            <p className="text-xl font-light text-sky-50">My Favorite Recipes</p>
          </div>
          <div className="flex gap-4 overflow-x-auto">
          <FavoriteRecipesCarousel favoriteRecipes={favoriteRecipes} />
          </div>
        </div>
  
        {/* Saved Recipes */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <Bookmark strokeWidth={1.5} className="w-6 h-6 text-pink-800 mr-2" />
            <p className="text-xl font-light text-sky-50">My Saved Recipes</p>
          </div>
          <div className="flex gap-4 overflow-x-auto">
          <SavedRecipesCarousel savedRecipes={savedRecipes} />
          </div>
        </div>
  
        {/* Shopping Lists Section */}
        <div>
          <div className="flex items-center mb-4">
            <ShoppingCart strokeWidth={1.5} className="w-6 h-6 text-pink-800 mr-2" />
            <p className="text-xl font-light text-sky-50">My Shopping Lists</p>
          </div>
          <div className="flex gap-4 overflow-x-auto">
            <ShoppingListsCarousel shoppingLists={shoppingLists} />
          </div>
        </div>
      </div>
  
      {/* Footer */}
    <div className="sticky bottom-0 z-10">
      <Footer actions={['user', 'send']} />
    </div>
    </div>
    
  );  
};

export default HomeScreen;
