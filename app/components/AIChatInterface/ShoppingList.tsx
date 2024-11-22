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
    <div className="shopping-list">
      <h2 className="text-3xl font-bold mb-6">Shopping List</h2>
      <ul className="list-disc pl-6 space-y-2">
        {shoppingListData.ingredients.map((item, index) => (
          <li key={index}>
            {item.name} - {item.quantity} {item.unit}
          </li>
        ))}
      </ul>
      <p className="mt-6 font-bold">Total Items: {shoppingListData.totalItems}</p>
    </div>
  );
};

export default ShoppingList;
