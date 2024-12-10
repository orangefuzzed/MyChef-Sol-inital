import React from 'react';
import { ShoppingListItem } from '../../../types/ShoppingListItem';

interface ShoppingListProps {
  shoppingListData: {
    ingredients: ShoppingListItem[];
    totalItems: number;
  };
}

const ShoppingList: React.FC<ShoppingListProps> = ({ shoppingListData }) => {
  return (
    <div className="shopping-list bg-white/30 backdrop-blur-lg border-white border shadow-lg ring-1 ring-black/5 p-6 rounded-2xl">
      <h2 className="text-2xl font-medium text-sky-50 text-center">Shopping List</h2>
      <div className="py-3 flex items-center text-sm text-black before:flex-1 before:border-t before:border-pink-800 before:me-6 after:flex-1 after:border-t after:border-pink-800 after:ms-6 dark:text-white dark:before:border-neutral-600 dark:after:border-neutral-600">ITEMS</div>
      <ul className="list-disc pl-6 space-y-2">
        {shoppingListData.ingredients.map((item, index) => (
          <li key={index}>
            {item.name} {/*- {item.quanity} {item.unit}*/}
          </li>
        ))}
      </ul>
      <p className="mt-6 font-semibold">Total Items: {shoppingListData.totalItems}</p>
    </div>
  );
};

export default ShoppingList;
