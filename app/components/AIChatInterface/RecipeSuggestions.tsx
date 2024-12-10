import React from 'react';
import Link from 'next/link';
import { Recipe } from '../../../types/Recipe';
import { Flame, Clock, Soup, CookingPot, ChefHat } from 'lucide-react';

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
          className="relative flex items-start bg-white/30 backdrop-blur-lg border-white border shadow-lg ring-1 ring-black/5 py-6 px-8 rounded-3xl ml-4 mb-4"
        >
          {/* Left-Side Icon */}
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -ml-6 bg-slate-500 w-10 h-10 border border-white rounded-full flex items-center justify-center">
            <CookingPot strokeWidth={1.5} className="w-6 h-6 text-white" /> {/* Example icon, you can change this */}
          </div>

          <div className="ml-4"> {/* Adds space to accommodate the left-side icon */}
            <h3 className="text-xl text-slate-950 font-bold">{recipe.recipeTitle}</h3>
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
              <button className="mt-4 p-2 px-6 bg-sky-50/20 border border-sky-50 shadow-lg ring-1 ring-black/5 rounded-full text-slate-950 flex items-center gap-2">
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