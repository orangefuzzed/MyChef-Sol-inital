'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import HamburgerMenu from '../components/HamburgerMenu';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { ChefHat } from 'lucide-react';
import MainDishCarousel from '../components/mainDishCarousel';
import { RecipeCategoryDocument } from '../../types/RecipeCategoryDocument';

const MyCookBook: React.FC = () => {
  const { data: session } = useSession();
  const [isHamburgerMenuOpen, setIsHamburgerMenuOpen] = useState(false);
  const [mainDishes, setMainDishes] = useState<EnrichedRecipeCategoryDocument[]>([]);

  interface EnrichedRecipeCategoryDocument extends RecipeCategoryDocument {
    recipeTitle: string;
  }

  useEffect(() => {
    const fetchMainDishes = async () => {
      try {
        const response = await fetch('/api/recipes/categories?mainCategory=Main Dishes');
        const data: RecipeCategoryDocument[] = await response.json();
  
        // Fetch the recipe details to get the `recipeTitle` (join with Recipe collection)
        const enrichedData = await Promise.all(
          data.map(async (categoryDoc) => {
            const recipeResponse = await fetch(`/api/recipes/details?id=${categoryDoc.recipeId}`);
            const recipeData = await recipeResponse.json();
  
            return {
              ...categoryDoc,
              recipeTitle: recipeData.recipeTitle, // Add recipeTitle from Recipe collection
            };
          })
        );
  
        setMainDishes(enrichedData); // Save the enriched data
      } catch (error) {
        console.error('Error fetching main dishes:', error);
      }
    };
  
    fetchMainDishes();
  }, [])  
  

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
        {/* Main Dishes Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <ChefHat strokeWidth={1.5} className="w-6 h-6 text-[#27ff52] mr-2" />
              <p className="text-xl font-light text-sky-50">Main Dishes</p>
            </div>
          </div>
          <MainDishCarousel recipes={mainDishes} />
        </div>
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 z-10">
        <Footer actions={['user', 'send']} />
      </div>
    </div>
  );
};

export default MyCookBook;
