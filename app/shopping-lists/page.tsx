// app/shopping-lists/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getAllSavedShoppingListsFromDB } from '../utils/shoppingListUtils';
import { useRouter } from 'next/navigation';
import { ShoppingList } from '../../types/ShoppingList';
import { ShoppingCart } from 'lucide-react';


const ShoppingListsPage = () => {
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchShoppingLists = async () => {
      const lists = await getAllSavedShoppingListsFromDB();
      if (lists) {
        setShoppingLists(lists);
      }
    };

    fetchShoppingLists();
  }, []);

  const handleViewShoppingList = (id: string) => {
    console.log("Navigating to Shopping List with ID:", id); // Debug log
    router.push(`/shopping-list?id=${id}`);
  };

  return (
    <div className="flex flex-col h-screen bg-fixed bg-cover bg-center text-white"
        style={{ backgroundImage: "url('/images/fresh-store-1.png')" }}
        >
      {/* Header */}
      <Header centralText="Saved Shopping Lists" />
  
      {/* Main Content */}
      <div className="flex-grow p-8 overflow-y-auto">
        {shoppingLists.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {shoppingLists.map((list) => (
              <div
              key={list.id} // Updated `recipeId` to `id`
                className="bg-white/30 backdrop-blur-lg border-white border shadow-lg ring-1 ring-black/5 p-6 rounded-2xl"
                onClick={() => handleViewShoppingList(list.id)} // Updated `recipeId` to `id`
              >
                {/* Left-Side Icon */}
                <div className="bg-sky-50/30 w-8 h-8 border border-white rounded-full flex items-center justify-center mb-2">
                  <ShoppingCart strokeWidth={1.5} className="w-4 h-4 text-black" /> {/* Example icon, you can change this */}
                </div>
                <h3 className="text-lg font-semibold mb-2">Shopping List for {list.recipeTitle || 'Recipe'}</h3>
                
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400">No shopping lists saved yet. Start by creating one!</div>
        )}
      </div>

  
      {/* Footer */}
      <Footer actions={['home', 'send']} />
    </div>
  );
  
};

export default ShoppingListsPage;
