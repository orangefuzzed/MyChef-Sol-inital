'use client';
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-lg font-bold">
          Meal Planner
        </Link>
        <div className="space-x-4">
          <Link href="/" className="text-white hover:text-gray-300">
            Home
          </Link>
          <Link href="/ai-chat" className="text-white hover:text-gray-300">
            AI Chat
          </Link>
          <Link href="/saved-recipes" className="text-white hover:text-gray-300">
            Saved Recipes
          </Link>
          <Link href="/saved-recipes" className="text-white hover:text-gray-300">
            Saved Recipe stuffs
          </Link>
          <Link href="/meal-planning" className="text-white hover:text-gray-300">
            Meal Planning
          </Link>
          <Link href="/preferences" className="text-white hover:text-gray-300">
            Preferences
          </Link>
          {/* Add more navigation links as needed */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;