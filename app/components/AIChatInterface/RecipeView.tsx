import React from 'react';
import Link from 'next/link';
import { Recipe } from '../../../types/Recipe';
import { ExternalLinkIcon } from '@radix-ui/react-icons';

interface RecipeViewProps {
  currentRecipeList: Recipe[];
}

const RecipeView: React.FC<RecipeViewProps> = ({ currentRecipeList }) => {
  if (currentRecipeList.length === 0) return null;

  return (
    <div className="recipe-suggestions">
      {currentRecipeList.map((recipe, index) => (
        <div key={`${recipe.recipeTitle}-${index}`} className="bg-gray-800 p-4 rounded-lg mb-4">
          <h3 className="text-xl font-bold">{recipe.recipeTitle}</h3>
          <p className="text-yellow-400">Rating: {recipe.rating}</p>
          <p className="text-gray-400">Protein: {recipe.protein}</p>
          <p className="mt-2">{recipe.description}</p>

          <Link
            href={{
              pathname: `/recipe-view`,
              query: { recipeId: recipe.recipeId }, // Use `recipeId` instead of `id`
            }}
          >
            <button className="mt-4 p-2 px-6 bg-slate-700 rounded-full text-white flex items-center gap-2">
              View Recipe
              <ExternalLinkIcon className="w-5 h-5" />
            </button>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default RecipeView;
