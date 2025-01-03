'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import HamburgerMenu from '../components/HamburgerMenu';
import Footer from '../components/Footer';
import Header from '../components/Header'; // Import the Header component
import SavedRecipesCarousel from '../components/SavedRecipesCarousel';
import ShoppingListsCarousel from '../components/ShoppingListsCarousel';
import GetStartedModal from './GetStartedModal';
import { ShoppingCart, Bookmark, Heart, ExternalLink, Rocket } from 'lucide-react';
import FavoriteRecipesCarousel from '../components/FavoriteRecipesCarousel';
import { getFavoriteRecipesFromDB } from '../utils/favoritesUtils';
import { Recipe } from '../../types/Recipe';
import { getAllSavedShoppingListsFromDB } from '../utils/shoppingListUtils';
import { ShoppingList } from '../../types/ShoppingList';
import { getSavedRecipesFromDB } from '../utils/indexedDBUtils'; // Assuming we fetch saved recipes here



const HomeScreen: React.FC = () => {
  const { data: session } = useSession();
  const [isHamburgerMenuOpen, setIsHamburgerMenuOpen] = useState(false);
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

  {/*const dummyWalkthroughCards = [
    {
      title: "Why Dishcovery is Different", // SLIDE 0
      description: "Not a recipe database. A recipe creator.",
      modalContent: "Create shopping lists and plan your meals for the week—all in one app.",
      imageSrc: "/images/pizza-1.png",
      slides: [
        {
          title: "Dishcovery is powered by Chef kAi, who crafts recipes just for you.",
          content: "Using the collective wisdom of chefs, cookbooks, and culinary history, Dishcovery doesn’t just give you a recipe—it creates the perfect recipe, tailored to your needs, your tastes, and your imagination.",
          content2: "TELL ME MORE⟶",
          imageSrc: "/images/porch-dinner-3.png",
        },
        {
          title: "What makes Dishcovery magical?",
          content: "Creative mastery: Every recipe is built with care, precision, and a deep understanding of what makes great food.",
          content2: "Culinary evolution: It’s not about following a recipe—it’s about creating a dish that feels like it was meant for you.",
          imageSrc: "/images/family-porch-1.png",
        },
      ],
    },
    {
      title: "DISHcover Recipes in Seconds!", // SLIDE 1
      description: "Your Culinary Genie Awaits!",
      modalContent: "Let Dishcovery’s AI grant your food wishes. Crave something exotic? Need a quick family dinner? Just ask—and watch the magic unfold.",
      imageSrc: "/images/steak-dinner-1.png", 
      slides: [
        {
          title: "DISHcover Recipes in Seconds!",
          description: "Your Culinary Genie Awaits",
          content: "Let Dishcovery’s AI grant your food wishes. Crave something exotic? Need a quick family dinner? Just ask—and watch the magic unfold.",
          content2: "Forget searching for hours—just ask and receive! Check out some PROMPT TIPS⟶",
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
      title: "Write the Perfect Prompt", // SLIDE 2
      description: "Get the most out of Dishcovery.",
      modalContent: "Learn to write creative prompts like 'Quick and easy dinner ideas' or 'High-protein breakfasts.' Dishcovery will take it from there!",
      imageSrc: "/images/breakfast-1.png", 
      slides: [
        {
          title: "Write the Perfect Prompt, Get the Perfect Dish.",
          description: "Get the most from the powerful Dishcovery Ai.",
          content: "Write creative prompts like 'Quick and easy dinner ideas using pantry staples' or 'High-protein breakfasts with eggs.'",
          content2: "Dietary restrictions or allergies? No problem! Just add descriptors like 'Gluten free' or 'Non-dairy' and Dishcovery will take it from there! PROMPT TIPS⟶",
          imageSrc: "/images/breakfast-1.png",
        },
        {
          title: "Recipe Prompt Tips",
          description: "Tip: combine creative phrases like 'Quick and easy dinner ideas' or 'High-protein breakfasts',",
          content: "with descriptive words like 'pantry staples', 'Gluten free' or 'Non-dairy'.",
          content2: "Sample Prompt: 'I need some quick and easy, gluten free, dinner ideas using pantry and refrigerator staples.'",
          imageSrc: "/images/steak-dinner-2.png",
        },
      ],
    },
    {
      title: "Save Your Favorites", // SLIDE 3
      description: "Keep track of recipes you love.",
      modalContent: "Never lose track of your favorite meals. Save recipes to revisit later and share them with friends!",
      imageSrc: "/images/steak-dinner-1.png", 
      slides: [
        {
          title: "Save Recipes Effortlessly",
          content: "Never lose track of your favorite meals. Save recipes to revisit later and share them with friends!",
          content2: "Dishcovery makes it easy to 'Save' (bookmark) and 'Favorite' (heart) your meals and recipes. Your personal cookbook is just a tap away. MORE FEATURES⟶",
          imageSrc: "/images/breakfast-3.png",
        },
        {
          title: "Never lose that Shopping List or Chat Session either!",
          content: "Dishcovery makes its simple to save your Shopping Lists so you won't forget your missing ingredients.",
          content2: "Save your recipe 'Chat' and never lose those fantastic recipe suggestions for 'spicy Mexican insprired appetizers'!",
          imageSrc: "/images/soup-2.png",
        },
      ],
    },
    {
      title: "Cook Mode Activated!", // SLIDE 4
      description: "Easy-to-Follow step-by-step instructions.",
      modalContent: "Never lose track of your favorite meals. Save recipes to revisit later and share them with friends!",
      imageSrc: "/images/man-kids-cooking-4.png", 
      slides: [
        {
          title: "Prepare Your Dishcovery Recipes Effortlessly",
          content: "Dishcovery's Cook Mode lets you focus on cooking with simple and clear, step-by-step instructions.",
          content2: "Andriod users enjoy automatic screen-wake in Cook Mode - no more tapping your screen with messy fingers! MORE FEATURES⟶",
          imageSrc: "/images/man-kids-cooking-4.png",
        },
        {
          title: "Coming Soon to Cook Mode:",
          content: "• Guided Meal Planning: Dynamic AI Pairing, Ingredient Sharing, and User-Driven Customization",
          content2: "• Cook Mode Timers: Smart Timer Integration, Interactive Alerts and Cross-Device Sync",
          imageSrc: "/images/chef-cooking-1.png",
        },
      ],
    },    
  ];*/}

  return (
    <div className="flex flex-col h-screen bg-fixed bg-cover bg-center text-white"
        style={{ backgroundImage: "url('/images/pizza-4.png')" }}
        >
      <Header centralText={`Welcome, ${session?.user?.name || 'Guest'}`} />
      
      {/* Menus */}
      <HamburgerMenu isOpen={isHamburgerMenuOpen} onClose={() => setIsHamburgerMenuOpen(false)} />
      
  
      {/* Main Content */}
      <div className="flex-grow overflow-y-auto px-6 py-4">

        {/* Walkthrough Section 
        <div className="mb-6">
        <div className="flex items-center mb-4">
            <Rocket strokeWidth={1.5} className="w-6 h-6 text-[#27ff52] mr-2" />
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
        </div>*/}
  
        {/* Render Modals 
        {dummyWalkthroughCards.map((card, index) => (
          <GetStartedModal
            key={index}
            isOpen={activeModalIndex === index} // Show the modal only if it's the active card
            onClose={() => setActiveModalIndex(null)} // Close modal when dismissed
            slides={card.slides} // Pass the slides specific to this card
          />
        ))}*/}

        {/* Favorites Section */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <Heart strokeWidth={1.5} className="w-6 h-6 text-sky-50 mr-2" />
            <p className="text-xl font-light text-sky-50">My Favorite Recipes</p>
          </div>
          <div className="flex gap-4 overflow-x-auto">
          <FavoriteRecipesCarousel favoriteRecipes={favoriteRecipes} />
          </div>
        </div>
  
        {/* Saved Recipes */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <Bookmark strokeWidth={1.5} className="w-6 h-6 text-sky-50 mr-2" />
            <p className="text-xl font-light text-sky-50">My Saved Recipes</p>
          </div>
          <div className="flex gap-4 overflow-x-auto">
          <SavedRecipesCarousel savedRecipes={savedRecipes} />
          </div>
        </div>
  
        {/* Shopping Lists Section */}
        <div>
          <div className="flex items-center mb-4">
            <ShoppingCart strokeWidth={1.5} className="w-6 h-6 text-sky-50 mr-2" />
            <p className="text-xl font-light text-sky-50">My Shopping Lists</p>
          </div>
          <div className="flex gap-4 overflow-x-auto">
            <ShoppingListsCarousel shoppingLists={shoppingLists} />
          </div>
        </div>
      </div>
  
      {/* Footer */}
    <div className="sticky bottom-0 z-10">
      <Footer actions={['home', 'send']} />
    </div>
    </div>
    
  );  
};

export default HomeScreen;
