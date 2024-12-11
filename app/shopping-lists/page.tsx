// app/shopping-lists/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getAllSavedShoppingListsFromDB } from '../utils/shoppingListUtils';
import { useRouter } from 'next/navigation';
import { ShoppingList } from '../../types/ShoppingList';


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
    router.push(`/shopping-list?id=${id}`); // Updated `recipeId` to `id`
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
                key={list.recipeId} // Updated `recipeId` to `id`
                className="bg-white/30 backdrop-blur-lg border-white border shadow-lg ring-1 ring-black/5 p-6 rounded-2xl"
                onClick={() => handleViewShoppingList(list.recipeId)} // Updated `recipeId` to `id`
              >
                <h3 className="text-lg font-semibold mb-2">Shopping List for {list.recipeTitle || 'Recipe'}</h3>
                
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400">No shopping lists saved yet. Start by creating one!</div>
        )}
      </div>

  
      {/* Footer */}
      <Footer actions={['home', 'save', 'send']} />
    </div>
  );
  
};

export default ShoppingListsPage;
