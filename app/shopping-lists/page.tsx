'use client';

import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {
  getAllSavedShoppingListsFromDB,
  deleteShoppingListFromDB,
} from '../utils/shoppingListUtils';
import { useRouter } from 'next/navigation';
import { ShoppingList } from '../../types/ShoppingList';
import { ShoppingCart, Trash2 } from 'lucide-react';
import Toast from '../components/Toast'; // Toast Component

const ShoppingListsPage = () => {
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const router = useRouter();

  // Toast State
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    const fetchShoppingLists = async () => {
      const lists = await getAllSavedShoppingListsFromDB();
      if (lists) {
        setShoppingLists(lists);
      }
    };

    fetchShoppingLists();
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);

    // Hide the toast automatically after 3 seconds
    setTimeout(() => setToastVisible(false), 3000);
  };

  const handleDeleteShoppingList = async (id: string) => {
    if (!id) return;

    try {
      // Delete from IndexedDB
      await deleteShoppingListFromDB(id);

      // Delete from MongoDB
      const response = await fetch(`/api/shopping-lists?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('Failed to delete shopping list from MongoDB:', await response.text());
        showToast('Failed to delete shopping list. Please try again.', 'error');
        return;
      }

      // Update UI and Toast
      setShoppingLists((prevLists) =>
        prevLists.filter((list) => list.id !== id)
      );
      showToast('Shopping list deleted successfully!', 'success');
    } catch (error) {
      console.error('Error while deleting shopping list:', error);
      showToast('Failed to delete shopping list. Please try again.', 'error');
    }
  };

  const handleViewShoppingList = (id: string) => {
    router.push(`/shopping-list?id=${id}`);
  };

  return (
    <div
      className="flex flex-col h-screen bg-fixed bg-cover bg-center text-white"
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
                key={list.id}
                className="bg-white/30 backdrop-blur-lg border-white border shadow-lg ring-1 ring-black/5 p-6 rounded-2xl relative"
              >
                {/* Left-Side Icon */}
                <div
                  className="bg-sky-50/30 w-8 h-8 border border-white rounded-full flex items-center justify-center mb-2"
                  onClick={() => handleViewShoppingList(list.id)}
                >
                  <ShoppingCart strokeWidth={1.5} className="w-4 h-4 text-black" />
                </div>

                {/* Delete Button */}
                <button
                  className="absolute top-4 right-4 bg-red-600 text-white p-2 rounded-full shadow-md hover:bg-red-500 transition"
                  onClick={() => handleDeleteShoppingList(list.id)}
                  aria-label="Delete Shopping List"
                >
                  <Trash2 size={16} />
                </button>

                <h3 className="text-lg font-semibold mb-2">
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

      {/* Footer */}
      <Footer actions={['home', 'send']} />

      {/* Toast Component */}
      {toastVisible && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setToastVisible(false)}
        />
      )}
    </div>
  );
};

export default ShoppingListsPage;
