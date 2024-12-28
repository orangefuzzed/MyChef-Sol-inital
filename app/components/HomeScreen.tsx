'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import HamburgerMenu from '../components/HamburgerMenu';

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
import OnboardingModal from './OnboardingModal';


const HomeScreen: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isHamburgerMenuOpen, setIsHamburgerMenuOpen] = useState(false);

  const [activeModalIndex, setActiveModalIndex] = useState<number | null>(null);
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [showOnboarding, setShowOnboarding] = useState(false);

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

  const onboardingSlides = [
    {
      header: 'Welcome to Dishcovery: Cooking reinvented. Magic unlocked.',
      body: 'Dishcovery is powered by Chef kAi, a specially trained, laser focused Ai, who crafts recipes just for you. Using the collective wisdom of chefs, cookbooks, and culinary history, Dishcovery doesn’t just give you a recipe—it creates the perfect recipe, tailored to your needs, your tastes, and your imagination.',
      imageSrc: "/images/dishcovery-full-logo.png",
    },
    {
      header: 'Collective Knowledge: Culinary Wisdom from Every Corner of the World',
      body: 'Dishcovery accesses ALL THE COOKING KNOWLEDGE across cultures, cuisines, history, and techniques. From Julia Child to Chef kAi to your great-grandma’s handwritten apple pie recipe, it’s all there.',
      imageSrc: "/images/pizza-2.png",
    },
    {
      header: 'Creative Flexibility: Cook Without Limits',
      body: 'Invent dishes that suit YOU. This isn’t just about “following instructions.” It’s about inventing new ones. Want a lasagna that’s also low-carb, vegetarian, but with a hint of Middle Eastern spices? Dishcovery’s AI doesn’t blink—it generates it on the fly. ',
      imageSrc: "/images/spread-2.png",
    },
    {
      header: 'Context-Aware Magic: Your Pantry, Our Playground',
      body: 'It’s not just creative—it’s situationally smart. It knows that your pantry has canned tuna, rice, and soy sauce, and it’s about to blow your mind with a 20-minute tuna rice bowl with a soy-miso glaze. That’s not search-and-retrieve—that’s understanding.',
      imageSrc: "/images/porch-dinner-3.png",
    },
    {
      header: 'Personalization at Its Best: Made for You, and Only You',
      body: 'This isn’t one-size-fits-all. It’s your size. It remembers what you like, learns your preferences, and serves up dishes tailored just for you. It knows you hate cilantro (don’t we all?), so it keeps that herb far away from your plate.',
      imageSrc: "/images/soup-3.png",
    },
    {
      header: 'Dishcovery’s Ethos: More Than Recipes—It’s Human Connection',
      body: 'And here’s the kicker, my friend. Dishcovery isn’t just about food—it’s about human connection. It’s a communal experience. Cooking is personal, it’s cultural, it’s creative, and it’s emotional. Dishcovery celebrates that.',
      imageSrc: "/images/porch-dinner-1.png",
    },
  ];

  const dummyWalkthroughCards = [
    {
      title: "DISHcover Recipes in Seconds!",
      description: "Your Culinary Genie Awaits",
      modalContent: "Let Dishcovery’s AI grant your food wishes. Crave something exotic? Need a quick family dinner? Just ask—and watch the magic unfold.",
      imageSrc: "/images/steak-dinner-1.png", // Example image
      slides: [
        {
          title: "DISHcover Recipes in Seconds!",
          description: "Your Culinary Genie Awaits",
          content: "Let Dishcovery’s AI grant your food wishes. Crave something exotic? Need a quick family dinner? Just ask—and watch the magic unfold.",
          content2: "Forget searching for hours—just ask and receive!",
          imageSrc: "/images/steak-dinner-1.png",
        },
        {
          title: "Recipe Prompt Tips",
          description: "Tip 1: Use specific phrases like 'Mexican appetizers' or 'easy gluten-free desserts.",
          content: "Tip 2: Use descriptive words for ingredients like 'fancy', 'traditional' or 'rustic'.",
          content2: "Sample Prompt: 'I’d like to make some fancy Mexican appetizers using traditional ingredients.'",
          imageSrc: "/images/dinner-1.png",
        },
      ],
    },
    {
      title: "Save Your Favorites",
      description: "Keep track of recipes you love.",
      modalContent: "Never lose track of your favorite meals. Save recipes to revisit later and share them with friends!",
      imageSrc: "/images/steak-dinner-1.png", // Example image
      slides: [
        {
          title: "Save Recipes Effortlessly",
          content: "Dishcovery makes it easy to bookmark your favorite meals.",
          content2: "Your personal cookbook is just a tap away.",
          imageSrc: "/images/steak-dinner-1.png",
        },
        {
          title: "Favorites at Your Fingertips",
          content: "Organize and share recipes with loved ones.",
          content2: "Because the best meals are the ones you share.",
          imageSrc: "/images/dinner-2.png",
        },
      ],
    },
    // Add similar slides for other cards
    {
      title: "Plan Your Meals",
      description: "Make meal planning a breeze.",
      modalContent: "Create shopping lists and plan your meals for the week—all in one app.",
      imageSrc: "/images/pizza-1.png",
      slides: [
        {
          title: "Meal Planning Made Easy",
          content: "Create your weekly shopping list with a single click.",
          content2: "No more forgetting ingredients at the store.",
          imageSrc: "/images/pizza-1.png",
        },
      ],
    },
  ];
  
  
  useEffect(() => {
    // Check if the user has seen the onboarding flow
    const fetchOnboardingStatus = async () => {
      try {
        const response = await fetch('/api/user/onboarding-status');
        const { hasSeenOnboarding } = await response.json();

        if (!hasSeenOnboarding) {
          setShowOnboarding(true);
        }
      } catch (error) {
        console.error('Failed to fetch onboarding status:', error);
      }
    };

    fetchOnboardingStatus();
  }, []);

  const handleOnboardingComplete = async () => {
    setShowOnboarding(false);

    try {
      await fetch('/api/user/onboarding-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hasSeenOnboarding: true }),
      });
    } catch (error) {
      console.error('Failed to update onboarding status:', error);
    }
  };

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
      
  
      {/* Main Content */}
      <div className="flex-grow overflow-y-auto px-6 py-4">

      <OnboardingModal
        isOpen={showOnboarding}
        onClose={handleOnboardingComplete} // Triggered when modal is closed
        slides={onboardingSlides} // Pass slides for the walkthrough
        onSkip={handleOnboardingComplete} // Triggered when "Skip" is clicked
        onComplete={handleOnboardingComplete} // Triggered when "Finish" is clicked
      />


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
            slides={card.slides} // Pass the slides specific to this card
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
