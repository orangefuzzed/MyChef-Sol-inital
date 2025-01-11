import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Recipe } from '../../../types/Recipe';
import { Flame, Clock, Soup, Wine } from 'lucide-react';

interface RecipeSuggestionsProps {
  currentRecipeList: Recipe[];
  handleRecipeSelect: (recipe: Recipe) => void;
  onPairingsRequest: (message: string) => void; // Pass the request up to the chat interface
}

const RecipeSuggestions: React.FC<RecipeSuggestionsProps> = ({ currentRecipeList, onPairingsRequest }) => {

  const [loadingPairings, setLoadingPairings] = useState(false);
  const [selectedRecipeTitle, setSelectedRecipeTitle] = useState<string | null>(null);

  const router = useRouter();

  const handleSuggestPairings = (recipe: Recipe) => {
    const pairingRequest = `Based on the following recipe, suggest one side dish or side salad (whichever is appropriate), and one drink pairing (if appropriate):
    - Recipe: ${recipe.recipeTitle}`;
    onPairingsRequest(pairingRequest); // Send the pairing request to the chat interface
  };

  if (currentRecipeList.length === 0) return null;

  const handleRecipeClick = (id: string) => {
    router.push(`/recipe-view?id=${id}`);
  };

  return (
    <div className="recipe-suggestions">
      {currentRecipeList.map((recipe, index) => (
        <div
          key={`${recipe.recipeTitle}-${index}`}
          className="relative flex items-start bg-white/30 backdrop-blur-lg border-white border shadow-lg ring-1 ring-black/5 py-4 px-6 rounded-3xl mb-4"
          onClick={() => handleRecipeClick(recipe.id)} // Card-level click
        >
          {/* Card content */}
          <div className="ml-2">
            <h3 className="text-xl text-sky-50 font-bold">{recipe.recipeTitle}</h3>
            <p className="text-amber-400 mb-2">{recipe.rating}</p>
  
            {/* Icons for kcal, time, protein */}
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex flex-col items-center text-xs text-slate-700">
                <Flame className="w-5 h-5 text-pink-800 mb-1" />
                <span>{recipe.calories}</span>
              </div>
              <div className="flex flex-col items-center text-xs text-slate-700">
                <Clock className="w-5 h-5 text-pink-800 mb-1" />
                <span>{recipe.cookTime}</span>
              </div>
              <div className="flex flex-col items-center text-xs text-slate-700">
                <Soup className="w-5 h-5 text-pink-800 mb-1" />
                <span>{recipe.protein} protein</span>
              </div>
            </div>
  
            <p className="text-slate-950 mb-4">{recipe.description}</p>
  
            <div className="mb-2 mt-4">
              {/* Suggest Pairings Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card click
                  handleSuggestPairings(recipe);
                }}
                className={`z-50 flex items-center justify-center w-full max-w-lg p-2 px-2 bg-white/20 border border-gray-300 shadow-lg ring-1 ring-black/5 rounded-full text-sm font-base text-sky-50 gap-2 ${
                  loadingPairings && selectedRecipeTitle === recipe.recipeTitle
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
                disabled={
                  loadingPairings && selectedRecipeTitle === recipe.recipeTitle
                }
              >
                {loadingPairings && selectedRecipeTitle === recipe.recipeTitle ? (
                  <>
                    Loading...
                    <div className="spinner-border animate-spin inline-block w-4 h-4 border-2 rounded-full ml-2"></div>
                  </>
                ) : (
                  <>
                    Suggest Pairings for this Dish
                    <Wine strokeWidth={1.5} className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );  
};

export default RecipeSuggestions;