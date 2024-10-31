'use client';

import React from 'react';
import { Recipe } from '@/types/Recipe';
import Link from 'next/link';

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  return (
    <div className="recipe-card bg-gray-800 p-4 rounded-lg">
      <h3 className="text-xl font-bold mb-2">{recipe.recipeTitle}</h3>
      <p className="text-sm mb-2">{recipe.description}</p>
      {/* Optionally display an image */}
      {recipe.imageURL && (
        <img src={recipe.imageURL} alt={recipe.recipeTitle} className="mb-2 rounded" />
      )}
      <Link
        href={{
          pathname: `/recipe`,
          query: { recipeData: JSON.stringify(recipe) },
        }}
      >
        <button className="mt-2 p-2 bg-blue-500 rounded-full text-white">
          View Recipe
        </button>
      </Link>
    </div>
  );
};

export default RecipeCard;
