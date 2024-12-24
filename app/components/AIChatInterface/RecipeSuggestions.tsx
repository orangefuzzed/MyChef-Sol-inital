import React from 'react';
import Link from 'next/link';
import { Recipe } from '../../../types/Recipe';
import { Flame, Clock, Soup, ChefHat } from 'lucide-react';

interface RecipeSuggestionsProps {
  currentRecipeList: Recipe[];
  handleRecipeSelect: (recipe: Recipe) => void;
}

const RecipeSuggestions: React.FC<RecipeSuggestionsProps> = ({ currentRecipeList }) => {
  if (currentRecipeList.length === 0) return null;

  return (
    <div className="recipe-suggestions">
      {currentRecipeList.map((recipe, index) => (
        <div
          key={`${recipe.recipeTitle}-${index}`}
          className="relative flex items-start bg-white/30 backdrop-blur-lg border-white border shadow-lg ring-1 ring-black/5 py-6 px-8 rounded-3xl mb-4"
        >
          

          <div className="ml-2"> {/* Adds space to accommodate the left-side icon */}
            <h3 className="text-xl text-sky-50 font-bold">{recipe.recipeTitle}</h3>
            <p className="text-amber-400 mb-2">{recipe.rating}</p>

            {/* Icons for kcal, time, protein */}
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex flex-col items-center text-xs text-slate-700">
                <Flame className="w-5 h-5 text-pink-800 mb-1" />
                <span> {recipe.calories}</span>
              </div>
              <div className="flex flex-col items-center text-xs text-slate-700">
                <Clock className="w-5 h-5 text-pink-800 mb-1" />
                <span> {recipe.cookTime} </span>
              </div>
              <div className="flex flex-col items-center text-xs text-slate-700">
                <Soup className="w-5 h-5 text-pink-800 mb-1" />
                <span> {recipe.protein} protein</span>
              </div>
            </div>

            <p className="text-slate-950 mb-4">{recipe.description}</p>

            <Link
              href={{
                pathname: `/recipe-view`,
                query: { id: recipe.id }, // Updated from recipeId to id
              }}
            >
              <button className="mt-4 p-2 px-6 bg-sky-50/20 border border-gray-300 shadow-lg ring-1 ring-black/5 rounded-full text-ky-50 flex items-center gap-2">
                View Recipe
                <ChefHat strokeWidth={1.5} className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecipeSuggestions;