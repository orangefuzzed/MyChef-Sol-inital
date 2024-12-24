'use client';

import React, { useEffect, useState } from 'react';
import { getAllSavedShoppingListsFromDB, saveShoppingListToDB } from '../utils/shoppingListUtils';
import { useRouter } from 'next/navigation';
import { ShoppingList } from '../../types/ShoppingList';
import { ShoppingCart } from 'lucide-react';

const ShoppingListsCarousel: React.FC = () => {
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const router = useRouter();

 useEffect(() => {
    const fetchAndMergeShoppingLists = async () => {
      try {
        // Fetch shopping lists from IndexedDB
        let localLists = await getAllSavedShoppingListsFromDB();
        localLists = localLists || []; // Ensure it's an array
  
        // Fetch shopping lists from MongoDB
        const remoteLists: ShoppingList[] = await (async () => {
          try {
            const response = await fetch('/api/shopping-lists');
            if (response.ok) {
              return await response.json();
            } else {
              console.error('Failed to fetch shopping lists from MongoDB:', response.statusText);
              return [];
            }
          } catch (error) {
            console.error('Error fetching shopping lists from MongoDB:', error);
            return [];
          }
        })();
  
        // Merge shopping lists into a single unique list
        const mergedListsMap = new Map<string, ShoppingList>();
        [...localLists, ...remoteLists].forEach((list) =>
          mergedListsMap.set(list.id, list) // Use `id` as the unique key
        );
  
        const mergedLists = Array.from(mergedListsMap.values());
  
        // Sync missing MongoDB shopping lists into IndexedDB
        for (const remoteList of remoteLists) {
          if (!localLists.some((localList) => localList.id === remoteList.id)) {
            await saveShoppingListToDB(remoteList.id, { 
              ingredients: remoteList.items, 
              totalItems: remoteList.totalItems 
            }, remoteList.recipeTitle); // Pass all required arguments
          }
        }
  
        // Update state with the merged shopping lists
        setShoppingLists(mergedLists);
      } catch (error) {
        console.error('Error fetching and merging shopping lists:', error);
      }
    };
  
    fetchAndMergeShoppingLists();
  }, []);;

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
              className="w-64 bg-white/30 backdrop-blur-lg border-white border shadow-lg ring-1 ring-black/5 px-6 pt-6 pb-1 rounded-2xl flex-shrink-0"
              onClick={() => handleViewShoppingList(list.id)}
            >
              {/* Icon */}
              <div className="bg-sky-50/30 w-8 h-8 border border-white rounded-full flex items-center justify-center mb-2">
                <ShoppingCart strokeWidth={1.5} className="w-4 h-4 text-black" />
              </div>
              <h3 className="text-lg font-light mb-2">
                  Shopping List for{' '}
                  <span className="text-sky-50 font-semibold">
                    {list.recipeTitle || 'Recipe'}
                  </span>
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
