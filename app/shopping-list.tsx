import React from 'react';
import { HeartIcon, HomeIcon, CogIcon } from '@heroicons/react/24/outline';

const ShoppingListView = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <button className="p-2 rounded-full bg-gray-200">
            <HomeIcon className="h-6 w-6 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Shopping List</h1>
          <button className="p-2 rounded-full bg-gray-200">
            <HeartIcon className="h-6 w-6 text-gray-600" />
          </button>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Shopping list content goes here */}
          <ul className="list-disc list-inside">
            <li className="text-gray-600">Item 1</li>
            <li className="text-gray-600">Item 2</li>
            <li className="text-gray-600">Item 3</li>
          </ul>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-around">
          <button className="p-2">
            <HomeIcon className="h-6 w-6 text-gray-600" />
          </button>
          <button className="p-2">
            <CogIcon className="h-6 w-6 text-gray-600" />
          </button>
          {/* Add more action buttons as needed */}
        </div>
      </div>
    </div>
  );
};

export default ShoppingListView;