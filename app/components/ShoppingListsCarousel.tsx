'use client';

import React from 'react';
import { ShoppingList } from '../../types/ShoppingList'; // Import ShoppingList type
import { useRouter } from 'next/navigation';
import { ShoppingCart } from 'lucide-react';

interface ShoppingListsCarouselProps {
  shoppingLists: ShoppingList[]; // Expect a list of shopping lists as a prop
}

const ShoppingListsCarousel: React.FC<ShoppingListsCarouselProps> = ({ shoppingLists }) => {
  const router = useRouter();

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
              <h3 className="text-lg font-light text-slate-950 mb-2">
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
