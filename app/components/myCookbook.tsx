'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import HamburgerMenu from '../components/HamburgerMenu';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { LeafyGreen, Drumstick, Popcorn, Ham, Sandwich, EggFried, Wine, Carrot, CakeSlice, Salad, Fish, Soup } from 'lucide-react';
import MainDishCarousel from '../components/mainDishCarousel';
import SideDishCarousel from '../components/sideDishCarousel';
import SaladsCarousel from '../components/saladsCarousel';
import DessertsCarousel from '../components/dessertsCarousel';
import AppetizersCarousel from '../components/appetizersCarousel';
import BeveragesCarousel from '../components/beveragesCarousel';
import BreakfastCarousel from '../components/breakfastCarousel';
import LunchCarousel from '../components/lunchCarousel';
import DinnerCarousel from '../components/dinnerCarousel';
import SnacksCarousel from '../components/snacksCarousel';
import HolidayCarousel from '../components/holidayCarousel';
import UncategorizedCarousel from '../components/uncategorizedCarousel';
import { RecipeCategoryDocument } from '../../types/RecipeCategoryDocument';

const MyCookBook: React.FC = () => {
  const { data: session } = useSession();
  const [isHamburgerMenuOpen, setIsHamburgerMenuOpen] = useState(false);
  const [mainDishes, setMainDishes] = useState<EnrichedRecipeCategoryDocument[]>([]);
  const [sideDishes, setSideDishes] = useState<EnrichedRecipeCategoryDocument[]>([]);
  const [salads, setSalads] = useState<EnrichedRecipeCategoryDocument[]>([]);
  const [desserts, setDesserts] = useState<EnrichedRecipeCategoryDocument[]>([]);
  const [appetizers, setAppetizers] = useState<EnrichedRecipeCategoryDocument[]>([]);
  const [beverages, setBeverages] = useState<EnrichedRecipeCategoryDocument[]>([]);
  const [breakfast, setBreakfast] = useState<EnrichedRecipeCategoryDocument[]>([]);
  const [lunch, setLunch] = useState<EnrichedRecipeCategoryDocument[]>([]);
  const [dinner, setDinner] = useState<EnrichedRecipeCategoryDocument[]>([]);
  const [snacks, setSnacks] = useState<EnrichedRecipeCategoryDocument[]>([]);
  const [holiday, setHoliday] = useState<EnrichedRecipeCategoryDocument[]>([]);
  const [uncategorized, setUncategorized] = useState<EnrichedRecipeCategoryDocument[]>([]);

  interface EnrichedRecipeCategoryDocument extends RecipeCategoryDocument {
    recipeTitle: string;
  }
// Fetch main dishes
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

 // Fetch side dishes 
  useEffect(() => {
    const fetchSideDishes = async () => {
      try {
        const response = await fetch('/api/recipes/categories?mainCategory=Side Dishes');
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
  
        setSideDishes(enrichedData); // Save the enriched data
      } catch (error) {
        console.error('Error fetching side dishes:', error);
      }
    };
  
    fetchSideDishes();
  }, []) 

// Fetch soup & salads  
  useEffect(() => {
    const fetchSalads = async () => {
      try {
        const response = await fetch(`/api/recipes/categories?mainCategory=${encodeURIComponent('Soup & Salads')}`);

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
  
        setSalads(enrichedData); // Save the enriched data
      } catch (error) {
        console.error('Error fetching salads:', error);
      }
    };
  
    fetchSalads();
  }, [])

// Fetch desserts  
  useEffect(() => {
    const fetchDesserts = async () => {
      try {
        const response = await fetch('/api/recipes/categories?mainCategory=Desserts');
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
  
        setDesserts(enrichedData); // Save the enriched data
      } catch (error) {
        console.error('Error fetching salads:', error);
      }
    };
  
    fetchDesserts();
  }, [])

  // Fetch appetizers  
  useEffect(() => {
    const fetchAppetizers = async () => {
      try {
        const response = await fetch('/api/recipes/categories?mainCategory=Appetizers');
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
  
        setAppetizers(enrichedData); // Save the enriched data
      } catch (error) {
        console.error('Error fetching salads:', error);
      }
    };
  
    fetchAppetizers();
  }, [])

    // Fetch beverages  
    useEffect(() => {
      const fetchBeverages = async () => {
        try {
          const response = await fetch('/api/recipes/categories?mainCategory=Beverages');
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
    
          setBeverages(enrichedData); // Save the enriched data
        } catch (error) {
          console.error('Error fetching salads:', error);
        }
      };
    
      fetchBeverages();
    }, [])

    // Fetch breakfast  
    useEffect(() => {
      const fetchBreakfast = async () => {
        try {
          const response = await fetch('/api/recipes/categories?mainCategory=Breakfast');
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

          setBreakfast(enrichedData); // Save the enriched data
        } catch (error) {
          console.error('Error fetching salads:', error);
        }
      };

      fetchBreakfast();
    }, [])
  
     // Fetch lunch  
     useEffect(() => {
      const fetchLunch = async () => {
        try {
          const response = await fetch('/api/recipes/categories?mainCategory=Lunch');
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

          setLunch(enrichedData); // Save the enriched data
        } catch (error) {
          console.error('Error fetching salads:', error);
        }
      };

      fetchLunch();
    }, [])

  // Fetch dinner  
  useEffect(() => {
    const fetchDinner = async () => {
      try {
        const response = await fetch('/api/recipes/categories?mainCategory=Dinner');
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

        setDinner(enrichedData); // Save the enriched data
      } catch (error) {
        console.error('Error fetching salads:', error);
      }
    };

    fetchDinner();
  }, [])

  // Fetch snacks  
  useEffect(() => {
    const fetchSnacks = async () => {
      try {
        const response = await fetch('/api/recipes/categories?mainCategory=Snacks');
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

        setSnacks(enrichedData); // Save the enriched data
      } catch (error) {
        console.error('Error fetching salads:', error);
      }
    };

    fetchSnacks();
  }, [])

  // Fetch holiday and seasonal  
  useEffect(() => {
    const fetchHoliday = async () => {
      try {
        const response = await fetch(`/api/recipes/categories?mainCategory=${encodeURIComponent('Holiday & Seasonal')}`);
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

        setHoliday(enrichedData); // Save the enriched data
      } catch (error) {
        console.error('Error fetching salads:', error);
      }
    };

    fetchHoliday();
  }, [])

  // Fetch Uncategorized  
  useEffect(() => {
    const fetchUncategorized = async () => {
      try {
        const response = await fetch('/api/recipes/categories?mainCategory=Uncategorized');
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

        setUncategorized(enrichedData); // Save the enriched data
      } catch (error) {
        console.error('Error fetching salads:', error);
      }
    };

    fetchUncategorized();
  }, [])

  return (
    <div
      className="flex flex-col h-screen bg-fixed bg-cover bg-center text-white"
      style={{ backgroundImage: "url('/images/spread-2.png')" }}
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
              <Fish strokeWidth={1.5} className="w-6 h-6 text-[#00f5d0] mr-2" />
              <p className="text-xl font-light text-sky-50">Main Dishes</p>
            </div>
          </div>
          <MainDishCarousel recipes={mainDishes} />
        </div>

        {/* Side Dishes Section */}
        <div className="mb-6">
         <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Soup strokeWidth={1.5} className="w-6 h-6 text-[#00f5d0] mr-2" />
              <p className="text-xl font-light text-sky-50">Side Dishes</p>
            </div>
          </div>
          <SideDishCarousel recipes={sideDishes} />
        </div>

        {/* Soup & Salads Section */}
        <div className="mb-6">
         <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Salad strokeWidth={1.5} className="w-6 h-6 text-[#00f5d0] mr-2" />
              <p className="text-xl font-light text-sky-50">Soup & Salads</p>
            </div>
          </div>
          <SaladsCarousel recipes={salads} />
        </div>

        {/* Desserts Section */}
        <div className="mb-6">
         <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <CakeSlice strokeWidth={1.5} className="w-6 h-6 text-[#00f5d0] mr-2" />
              <p className="text-xl font-light text-sky-50">Desserts</p>
            </div>
          </div>
          <DessertsCarousel recipes={desserts} />
        </div>

        {/* Appetizers Section */}
        <div className="mb-6">
         <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Carrot strokeWidth={1.5} className="w-6 h-6 text-[#00f5d0] mr-2" />
              <p className="text-xl font-light text-sky-50">Appetizers</p>
            </div>
          </div>
          <AppetizersCarousel recipes={appetizers} />
        </div>

        {/* Beverages Section */}
        <div className="mb-6">
         <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Wine strokeWidth={1.5} className="w-6 h-6 text-[#00f5d0] mr-2" />
              <p className="text-xl font-light text-sky-50">Beverages</p>
            </div>
          </div>
          <BeveragesCarousel recipes={beverages} />
        </div>

        {/* Breakfast Section */}
        <div className="mb-6">
         <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <EggFried strokeWidth={1.5} className="w-6 h-6 text-[#00f5d0] mr-2" />
              <p className="text-xl font-light text-sky-50">Breakfast</p>
            </div>
          </div>
          <BreakfastCarousel recipes={breakfast} />
        </div>

        {/* Lunch Section */}
        <div className="mb-6">
         <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Sandwich strokeWidth={1.5} className="w-6 h-6 text-[#00f5d0] mr-2" />
              <p className="text-xl font-light text-sky-50">Lunch</p>
            </div>
          </div>
          <LunchCarousel recipes={lunch} />
        </div>

        {/* Dinner Section */}
        <div className="mb-6">
         <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Ham strokeWidth={1.5} className="w-6 h-6 text-[#00f5d0] mr-2" />
              <p className="text-xl font-light text-sky-50">Dinner</p>
            </div>
          </div>
          <DinnerCarousel recipes={dinner} />
        </div>

        {/* Snacks Section */}
        <div className="mb-6">
         <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Popcorn strokeWidth={1.5} className="w-6 h-6 text-[#00f5d0] mr-2" />
              <p className="text-xl font-light text-sky-50">Snacks</p>
            </div>
          </div>
          <SnacksCarousel recipes={snacks} />
        </div>

        {/* Holiday and Seasonal Section */}
        <div className="mb-6">
         <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Drumstick strokeWidth={1.5} className="w-6 h-6 text-[#00f5d0] mr-2" />
              <p className="text-xl font-light text-sky-50">Holiday & Seasonal</p>
            </div>
          </div>
          <HolidayCarousel recipes={holiday} />
        </div>

        {/* Uncategorized Section */}
        <div className="mb-6">
         <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <LeafyGreen strokeWidth={1.5} className="w-6 h-6 text-[#00f5d0] mr-2" />
              <p className="text-xl font-light text-sky-50">Uncategorized</p>
            </div>
          </div>
          <UncategorizedCarousel recipes={uncategorized} />
        </div>

      </div>

      {/* Footer */}
      <div className="sticky bottom-0 z-10">
        <Footer actions={['home', 'send']} />
      </div>
    </div>
  );
};

export default MyCookBook;
