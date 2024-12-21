'use client';

import React, { useEffect, useState } from 'react';
import { getAllSavedShoppingListsFromDB } from '../utils/shoppingListUtils';
import { useRouter } from 'next/navigation';
import { ShoppingList } from '../../types/ShoppingList';
import { ShoppingCart } from 'lucide-react';

const ShoppingListsCarousel: React.FC = () => {
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchShoppingLists = async () => {
      try {
        const lists = await getAllSavedShoppingListsFromDB();
        if (lists) {
          setShoppingLists(lists);
        }
      } catch (error) {
        console.error('Error fetching shopping lists:', error);
      }
    };

    fetchShoppingLists();
  }, []);

  const handleViewShoppingList = (id: string) => {
    router.push(`/shopping-list?id=${id}`);
  };

  return (
    <div className="p">
      <h2 className="text-2xl font-bold text-sky-50 mb-4 hidden">Shopping Lists</h2>
      {shoppingLists.length > 0 ? (
        <div className="flex gap-6 overflow-x-auto scrollbar-hide">
          {shoppingLists.map((list) => (
            <div
              key={list.id}
              className="w-64 bg-white/30 backdrop-blur-lg border-white border shadow-lg ring-1 ring-black/5 p-6 rounded-2xl flex-shrink-0"
              onClick={() => handleViewShoppingList(list.id)}
            >
              {/* Icon */}
              <div className="bg-sky-50/30 w-8 h-8 border border-white rounded-full flex items-center justify-center mb-2">
                <ShoppingCart strokeWidth={1.5} className="w-4 h-4 text-black" />
              </div>
              <h3 className="text-lg font-semibold">
                Shopping List for {list.recipeTitle || 'Recipe'}
              </h3>
              
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400">
          No shopping lists saved yet. Start by creating one!
        </div>
      )}
    </div>
  );
};

export default ShoppingListsCarousel;
