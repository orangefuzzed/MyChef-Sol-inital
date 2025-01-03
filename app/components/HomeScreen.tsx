'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import HamburgerMenu from '../components/HamburgerMenu';
import Footer from '../components/Footer';
import Header from '../components/Header'; // Import the Header component
import GetStartedModal from './GetStartedModal';
import { ChefHat, ExternalLink, Clock, RefreshCw, Rocket, BotMessageSquare } from 'lucide-react';
import OnboardingModal from './OnboardingModal';
import TrendingRecipesCarousel from '../components/TrendingRecipesCarousel';
import RecentRecipesCarousel from '../components/RecentRecipesCarousel';
import PromptsCarousel from '../components/PromptsCarousel';
import { Prompt } from '../../types/Prompt';


const HomeScreen: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isHamburgerMenuOpen, setIsHamburgerMenuOpen] = useState(false);
  const [activeModalIndex, setActiveModalIndex] = useState<number | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false); 
  const [trendingRecipes, setTrendingRecipes] = useState([]);
  const [isRefreshingTrending, setIsRefreshingTrending] = useState(false); // Loading state for Trending Recipes refresh
  const [recentRecipes, setRecentRecipes] = useState([]);
  const [isRefreshingRecent, setIsRefreshingRecent] = useState(false); // Loading state for Trending Recipes refresh
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isRefreshingPrompts, setIsRefreshingPrompts] = useState(false);

  const onboardingSlides = [
    {
      header: 'Welcome to Dishcovery: Cooking reinvented. Magic unlocked.',
      body: 'Dishcovery is powered by Chef kAi, a specially trained, laser focused Ai, who crafts recipes just for you. Using the collective wisdom of chefs, cookbooks, and culinary history, Dishcovery doesn’t just give you a recipe—it creates the perfect recipe, tailored to your needs, your tastes, and your imagination.',
      imageSrc: "/images/dishcovery-full-logo_sm_02.png",
    },
    {
      header: 'Collective Knowledge: Culinary Wisdom from Every Corner of the World',
      body: 'Dishcovery accesses ALL THE COOKING KNOWLEDGE available across cultures, cuisines, history, and techniques. From Julia Child to Emiril Lagasse to Chef kAi to your great-grandma’s handwritten apple pie recipe, it’s all there.',
      imageSrc: "/images/pizza-2.png",
    },
    {
      header: 'Creative Flexibility: Cook Without Limits',
      body: 'Invent dishes that suit YOU. This isn’t just about “following instructions.” It’s about inventing new ones. Want a lasagna that’s also low-carb, vegetarian, but with a hint of Middle Eastern spices? Dishcovery’s AI doesn’t blink—it generates it on the fly. (and yes, please, go try this one for yourself!) ',
      imageSrc: "/images/spread-2.png",
    },
    {
      header: 'Context-Aware Magic: Your Pantry, Our Playground',
      body: 'It’s not just creative—it’s situationally smart. Tell Dishcovery your pantry has canned tuna, rice, and soy sauce, and it’s about to blow your mind with a 20-minute tuna rice bowl with a soy-miso glaze. That’s not search-and-retrieve—that’s understanding.',
      imageSrc: "/images/porch-dinner-3.png",
    },
    {
      header: 'Personalization at Its Best: Made for You, and Only You',
      body: 'This isn’t one-size-fits-all. It’s your size. Dishcovery remembers what you like, learns your preferences, and serves up dishes tailored just for you. It knows you hate anchovies (lol, don’t we all!?), so it keeps those little fishies far away from your plate.',
      imageSrc: "/images/soup-3.png",
    },
    {
      header: 'Dishcovery’s Ethos: More Than Recipes—It’s Human Connection',
      body: 'And here’s the kicker: Dishcovery isn’t just about food—it’s about human connection. It’s a communal experience. Cooking is personal, it’s cultural, it’s creative, and it’s emotional. Dishcovery celebrates that.',
      imageSrc: "/images/porch-dinner-1.png",
    },
  ];

  const dummyWalkthroughCards = [
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
      title: "DISHcover Recipes in Seconds", // SLIDE 1
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
  ];

    // Redirect to login page if not authenticated
    useEffect(() => {
      if (status === 'unauthenticated') {
        router.push('/login');
      }
    }, [status, router]);
  
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

  useEffect(() => {
    const fetchTrendingRecipes = async () => {
      try {
        const response = await fetch('/api/recipes/trending');
        const data = await response.json();
        setTrendingRecipes(data);
      } catch (error) {
        console.error('Error fetching trending recipes:', error);
      }
    };
  
    fetchTrendingRecipes();
  }, []); // Fetch trending recipes on mount
  
  useEffect(() => {
    const fetchRecentRecipes = async () => {
      try {
        const response = await fetch('/api/recipes/recent');
        const data = await response.json();
        setRecentRecipes(data);
      } catch (error) {
        console.error('Error fetching recent recipes:', error);
      }
    };
  
    fetchRecentRecipes();
  }, []); // Fetch recent recipes on mount

  // Fetch prompts on component mount
  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const response = await fetch('/api/prompts');
        const data = await response.json();
        setPrompts(data);
      } catch (error) {
        console.error('Error fetching prompts:', error);
      }
    };

    fetchPrompts();
  }, []);
  
  // Refresh handler for Recent Recipes
  const handleRefreshRecent = async () => {
    setIsRefreshingRecent(true); // Start loading
    try {
      const response = await fetch('/api/recipes/recent');
      const data = await response.json();
      setRecentRecipes(data);
    } catch (error) {
      console.error('Error refreshing recent recipes:', error);
    }
    setIsRefreshingRecent(false); // End loading
  };

  // Refresh handler for Trending Recipes
  const handleRefreshTrending = async () => {
    setIsRefreshingTrending(true); // Start loading
    try {
      const response = await fetch('/api/recipes/trending');
      const data = await response.json();
      setTrendingRecipes(data);
    } catch (error) {
      console.error('Error refreshing trending recipes:', error);
    }
    setIsRefreshingTrending(false); // End loading
  };

  // Refresh handler for Prompts
  const handleRefreshPrompts = async () => {
    setIsRefreshingPrompts(true);
    try {
      const response = await fetch('/api/prompts');
      const data = await response.json();
      setPrompts(data);
    } catch (error) {
      console.error('Error refreshing prompts:', error);
    }
    setIsRefreshingPrompts(false);
  };

  const handleNextSlide = () => {
    setCurrentSlideIndex((prevIndex) => Math.min(prevIndex + 1, dummyWalkthroughCards.length - 1));
  };

  const handlePrevSlide = () => {
    setCurrentSlideIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  return (
    <div
      className="flex flex-col h-screen bg-fixed bg-cover bg-center text-white"
      style={{ backgroundImage: "url('/images/meal-cooking-1.png')" }}
    >
      <Header centralText={`Welcome, ${session?.user?.name || 'Guest'}`} />
  
      {/* Menus */}
      <HamburgerMenu isOpen={isHamburgerMenuOpen} onClose={() => setIsHamburgerMenuOpen(false)} />
  
      {/* Main Content */}
      <div className="flex-grow overflow-y-auto px-6 py-4">
        <OnboardingModal
          isOpen={showOnboarding}
          onClose={handleOnboardingComplete}
          slides={onboardingSlides}
          onSkip={handleOnboardingComplete}
          onComplete={handleOnboardingComplete}
        />
  
        {/* Walkthrough Section */}
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
                onClick={() => setActiveModalIndex(index)}
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
            isOpen={activeModalIndex === index}
            onClose={() => setActiveModalIndex(null)}
            slides={card.slides}
            currentSlideIndex={currentSlideIndex} // Pass current slide index
            onNext={handleNextSlide} // Add the "onNext" handler
            onPrev={handlePrevSlide} // Add the "onPrev" handler
          />
        ))}
  
        {/* Trending Recipes Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <ChefHat strokeWidth={1.5} className="w-6 h-6 text-[#27ff52] mr-2" />
              <p className="text-xl font-light text-sky-50">Trending Recipes</p>
            </div>
            {/* Refresh Button */}
            <button
              onClick={handleRefreshTrending}
              disabled={isRefreshingTrending}
              className="flex items-center text-[#27ff52] ml-4"
            >
              <RefreshCw
                className={`w-5 h-5 ${isRefreshingTrending ? 'animate-spin' : ''}`}
              />
              <span className="ml-2 text-slate-400 text-sm">refresh</span>
            </button>
          </div>
          <TrendingRecipesCarousel recipes={trendingRecipes} onRefresh={handleRefreshTrending}/>
        </div>

        {/* Prompts Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <BotMessageSquare strokeWidth={1.5} className="w-6 h-6 text-[#27ff52] mr-2" />
              <p className="text-xl font-light text-sky-50">Recent Prompts</p>
            </div>
            {/* Refresh Button */}
            <button
              onClick={handleRefreshPrompts}
              disabled={isRefreshingPrompts}
              className="flex items-center text-[#27ff52] ml-4"
            >
              <RefreshCw
                className={`w-5 h-5 ${isRefreshingPrompts ? 'animate-spin' : ''}`}
              />
              <span className="ml-2 text-slate-400 text-sm">refresh</span>
            </button>
          </div>
          <PromptsCarousel prompts={prompts} onRefresh={handleRefreshPrompts} />
        </div>
  
        {/* Recent Recipes Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Clock strokeWidth={1.5} className="w-6 h-6 text-[#27ff52] mr-2" />
              <p className="text-xl font-light text-sky-50">Recent Recipes</p>
            </div>
            {/* Refresh Button */}
            <button
              onClick={handleRefreshRecent}
              disabled={isRefreshingRecent}
              className="flex items-center text-[#27ff52] ml-4"
            >
              <RefreshCw
                className={`w-5 h-5 ${isRefreshingRecent ? 'animate-spin' : ''}`}
              />
              <span className="ml-2 text-slate-400 text-sm">refresh</span>
            </button>
          </div>
          <RecentRecipesCarousel recipes={recentRecipes} onRefresh={handleRefreshRecent}/>
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
