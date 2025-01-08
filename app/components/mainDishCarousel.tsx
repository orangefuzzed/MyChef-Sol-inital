'use client';

import React from 'react';
import { RecipeCategoryDocument } from '../../types/RecipeCategoryDocument'; // New type!
import { useRouter } from 'next/navigation';
import { ChefHat, Clock } from 'lucide-react';

interface RecipesCarouselProps {
  recipes: ExtendedRecipeCategoryDocument[]; // Use the extended type
}

interface ExtendedRecipeCategoryDocument extends RecipeCategoryDocument {
  recipeTitle: string; // Dynamically add recipeTitle
}

const MainDishCarousel: React.FC<RecipesCarouselProps> = ({ recipes }) => {
  const router = useRouter();

  const handleRecipeClick = (recipeId: string) => {
    router.push(`/recipe-view?id=${recipeId}`);
  };

  return (
    <div>
      <div className="flex gap-6 overflow-x-auto scrollbar-hide">
      {recipes.map((recipe, index) => (
        <div
          key={`${recipe.recipeId}-${index}`}
          className="w-64 bg-white/30 backdrop-blur-lg border-white border shadow-lg px-6 pt-6 pb-4 rounded-2xl flex-shrink-0 cursor-pointer hover:shadow-2xl transition"
          onClick={() => handleRecipeClick(recipe.recipeId)}
        >
          {/* Use recipeTitle for the title */}
        <h3 className="text-md font-semibold text-sky-50 mb-2">{recipe.recipeTitle}</h3>
        <div className="flex items-center text-xs text-pink-800 mb-2">
          <ChefHat className="w-4 h-4 mr-1" />
          <span>{recipe.mainCategory || 'Uncategorized'}</span>
          </div>
          <div className="flex items-center text-xs text-gray-400">
            <Clock className="w-4 h-4 mr-1" />
            <span>{new Date(recipe.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      ))}
    </div>

    </div>
  );
};

export default MainDishCarousel;