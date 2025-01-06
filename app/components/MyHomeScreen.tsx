'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import HamburgerMenu from '../components/HamburgerMenu';
import Footer from '../components/Footer';
import Header from '../components/Header'; // Import the Header component
import SavedRecipesCarousel from '../components/SavedRecipesCarousel';
import ShoppingListsCarousel from '../components/ShoppingListsCarousel';
import { ShoppingCart, Bookmark, Heart } from 'lucide-react';
import FavoriteRecipesCarousel from '../components/FavoriteRecipesCarousel';
import { getFavoriteRecipesFromDB } from '../utils/favoritesUtils';
import { Recipe } from '../../types/Recipe';
import { getAllSavedShoppingListsFromDB } from '../utils/shoppingListUtils';
import { ShoppingList } from '../../types/ShoppingList';
import { getSavedRecipesFromDB } from '../utils/indexedDBUtils'; // Assuming we fetch saved recipes here

const HomeScreen: React.FC = () => {
  const { data: session } = useSession();
  const [isHamburgerMenuOpen, setIsHamburgerMenuOpen] = useState(false);
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true); // Add a loading state for better UX


  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true); // Start loading

      try {
        // Fetch all data from IndexedDB in parallel
        const [localFavorites, localShoppingLists, localSavedRecipes] = await Promise.all([
          getFavoriteRecipesFromDB(),
          getAllSavedShoppingListsFromDB(),
          getSavedRecipesFromDB(),
        ]);

        // Update state once all fetches complete
        setFavoriteRecipes(localFavorites || []); // Default to empty array if null
        setShoppingLists(localShoppingLists || []);
        setSavedRecipes(localSavedRecipes || []);
      } catch (error) {
        console.error('Error fetching data from IndexedDB:', error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchAllData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        <p>Loading your discoveries...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-fixed bg-cover bg-center text-white"
        style={{ backgroundImage: "url('/images/pizza-4.png')" }}
        >
      <Header centralText={`Welcome, ${session?.user?.name || 'Guest'}`} />
      
      {/* Menus */}
      <HamburgerMenu isOpen={isHamburgerMenuOpen} onClose={() => setIsHamburgerMenuOpen(false)} />
      
  
      {/* Main Content */}
      <div className="flex-grow overflow-y-auto px-6 py-4">

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
