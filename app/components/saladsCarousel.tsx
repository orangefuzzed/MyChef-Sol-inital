'use client';

import React from 'react';
import { RecipeCategoryDocument } from '../../types/RecipeCategoryDocument'; // New type!
import { useRouter } from 'next/navigation';
import { Salad, Clock } from 'lucide-react';

interface RecipesCarouselProps {
  recipes: ExtendedRecipeCategoryDocument[]; // Use the extended type
}

interface ExtendedRecipeCategoryDocument extends RecipeCategoryDocument {
  recipeTitle: string; // Dynamically add recipeTitle
}

const SaladsCarousel: React.FC<RecipesCarouselProps> = ({ recipes }) => {
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
          className="w-64 bg-white/30 backdrop-blur-lg border-white border shadow-lg p-4 rounded-2xl flex-shrink-0 cursor-pointer hover:shadow-2xl transition"
          onClick={() => handleRecipeClick(recipe.recipeId)}
        >      
        <div className="flex items-center text-sm text-sky-50 mb-2">
          <Salad strokeWidth={1.5} className="text-slate-950 bg-sky-50/30 w-7 h-7 p-1 mr-2 border border-white rounded-full flex items-center justify-center" />
          <span>{recipe.mainCategory || 'Uncategorized'}</span>
        </div>
        {/* Use recipeTitle for the title */}
        <h3 className="text-md font-semibold text-sky-50 mb-3">{recipe.recipeTitle}</h3>
          <div className="flex items-center font-medium text-xs text-slate-950">
            <Clock className="w-4 h-4 mr-2" />
            <span>{new Date(recipe.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      ))}
    </div>

    </div>
  );
};

export default SaladsCarousel;