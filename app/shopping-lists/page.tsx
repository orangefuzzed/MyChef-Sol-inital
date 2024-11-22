// app/shopping-lists/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getAllSavedShoppingListsFromDB, deleteShoppingListFromDB } from '../utils/shoppingListUtils';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';

const ShoppingListsPage = () => {
  const [shoppingLists, setShoppingLists] = useState<any[]>([]);
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

  const handleViewShoppingList = (recipeId: string) => {
    router.push(`/shopping-list?recipeId=${recipeId}`);
  };

  const handleDeleteShoppingList = async (recipeId: string) => {
    await deleteShoppingListFromDB(recipeId);
    setShoppingLists((prevLists) => prevLists.filter((list) => list.recipeId !== recipeId));
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white overflow-hidden">
      {/* Header */}
      <Header centralText="Saved Shopping Lists" />

      {/* Main Content */}
      <div className="flex-grow p-8 overflow-y-auto">
        {shoppingLists.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {shoppingLists.map((list) => (
              <div
                key={list.recipeId}
                className="bg-gray-800 p-4 rounded-lg cursor-pointer hover:bg-gray-700 relative"
              >
                <h3 className="text-lg font-semibold mb-2">Shopping List for {list.recipeTitle || 'Recipe'}</h3>
                <p className="text-sm text-gray-400">Items: {list.shoppingList.totalItems}</p>
                <button
                  onClick={() => handleViewShoppingList(list.recipeId)}
                  className="absolute top-2 right-2 p-2 bg-blue-600 text-white rounded-full"
                >
                  View
                </button>
                <button
                  onClick={() => handleDeleteShoppingList(list.recipeId)}
                  className="absolute bottom-2 right-2 p-2 bg-red-600 text-white rounded-full"
                >
                  <Trash2 size={16} />
                </button>
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
