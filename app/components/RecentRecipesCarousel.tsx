'use client';

import React from 'react';
import { Recipe } from '../../types/Recipe'; // Import Recipe type
import { useRouter } from 'next/navigation';
import { Flame, Timer, Ham, Pizza } from 'lucide-react';

interface RecipesCarouselProps {
  recipes: Recipe[]; // Expect a list of recipes as a prop
  onRefresh?: () => void;
}

const TrendingRecipesCarousel: React.FC<RecipesCarouselProps> = ({ recipes, onRefresh }) => {
  const router = useRouter();

  const handleRecipeClick = (id: string) => {
    router.push(`/recipe-view?id=${id}`);
  };

  return (
    <div>
      <div className="flex gap-6 overflow-x-auto scrollbar-hide">
        {recipes.map((recipe, index) => (
          <div
            key={`${recipe.id}-${index}`}  // <-- Index appended
            className="w-80 bg-white/30 backdrop-blur-lg border-white border shadow-lg px-6 pt-6 pb-4 rounded-2xl flex-shrink-0 cursor-pointer hover:shadow-2xl transition"
            onClick={() => handleRecipeClick(recipe.id)}
          >
            <h3 className="text-lg font-semibold">{recipe.recipeTitle}</h3>
            <div className="text-sm text-amber-400 mb-2">
              {recipe.rating || '★★★★★'}
            </div>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex flex-col items-center text-xs text-slate-950">
                <Flame className="w-5 h-5 text-pink-800 mb-1" />
                <span>{recipe.calories}</span>
              </div>
              <div className="flex flex-col items-center text-xs text-slate-950">
                <Timer className="w-5 h-5 text-pink-800 mb-1" />
                <span>{recipe.cookTime}</span>
              </div>
              <div className="flex flex-col items-center text-xs text-slate-950">
                <Ham className="w-5 h-5 text-pink-800 mb-1" />
                <span>{recipe.protein} pro</span>
              </div>
              <div className="flex flex-col items-center text-xs text-slate-950">
                <Pizza className="w-5 h-5 text-pink-800 mb-1" />
                <span> {recipe.carbs} carb</span>
              </div>
            </div>
            <p className="text-sm">{recipe.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingRecipesCarousel;
