// RecipeDetails.tsx - Updated for Suspense and Loading Component
import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useRecipeContext } from '../../contexts/RecipeContext';
import { Recipe } from '../../../types/Recipe';
import { generateShoppingList } from '../../utils/shoppingListUtils';
import { Flame, Clock, Soup, ShoppingCart, ChefHat } from 'lucide-react';
import Loading from '../../loading'; // Use your existing Loading component

// Wrapping the entire page in Suspense
const RecipeDetailsPageWrapper = () => {
  return (
    <Suspense fallback={<Loading />}>
      <RecipeDetails />
    </Suspense>
  );
};

const RecipeDetails: React.FC = () => {
  const searchParams = useSearchParams();
  const id = searchParams ? searchParams.get('id') : null; // Null-check for searchParams
  const { selectedRecipe, setSelectedRecipe, setCurrentShoppingList } = useRecipeContext();
  const [loading, setLoading] = useState(true); // Proper destructuring

  useEffect(() => {
    const loadRecipe = async () => {
      if (id) {
        try {
          const response = await fetch(`/api/recipes/saved?id=${id}`);
          if (response.ok) {
            const fetchedRecipe: Recipe = await response.json();
            setSelectedRecipe(fetchedRecipe);
          } else {
            console.error('No recipe found with the provided ID');
          }
        } catch (error) {
          console.error('Failed to fetch recipe by ID:', error);
        } finally {
          setLoading(false); // Stop the loading state
        }
      } else {
        setLoading(false); // Stop the loading state
      }
    };

    loadRecipe();
  }, [id, setSelectedRecipe]);

  const handleCreateShoppingList = () => {
    if (selectedRecipe) {
      const shoppingList = generateShoppingList(selectedRecipe);
      setCurrentShoppingList(shoppingList);
    }
  };

  // Show loading state if still fetching
  if (loading) {
    return <Loading />;
  }

  if (!selectedRecipe) {
    return <div className="text-white p-4">Recipe not found. Please go back and select a recipe.</div>;
  }

  return (
    <div className="recipe-details-container bg-white/30 backdrop-blur-lg border-white border shadow-lg ring-1 ring-black/5 p-6 rounded-2xl">
      <h2 className="text-xl text-white font-bold">{selectedRecipe.recipeTitle}</h2>
      <div className="rating text-amber-400 mb-2">Rating: {selectedRecipe.rating}</div>

      {/* Icons for kcal, time, protein */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex flex-col items-center text-xs text-black">
          <Flame className="w-5 h-5 text-pink-800 mb-1" />
          <span> {selectedRecipe.calories}</span>
        </div>
        <div className="flex flex-col items-center text-xs text-black">
          <Clock className="w-5 h-5 text-pink-800 mb-1" />
          <span> {selectedRecipe.cookTime} </span>
        </div>
        <div className="flex flex-col items-center text-xs text-black">
          <Soup className="w-5 h-5 text-pink-800 mb-1" />
          <span> {selectedRecipe.protein} protein</span>
        </div>
      </div>

      <section className="ingredients mb-6">
        <h3 className="text-2xl text-black font-semibold mb-2">Ingredients</h3>
        <ul className="list-disc list-inside">
          {selectedRecipe.ingredients.map((ingredient, index) => (
            <li key={index}>{typeof ingredient === 'string' ? ingredient : ingredient.name}</li>
          ))}
        </ul>
      </section>

      <section className="instructions mb-6">
        <h3 className="text-2xl text-black font-semibold mb-2">Instructions</h3>
        <ol className="list-decimal list-inside">
          {selectedRecipe.instructions.map((step, index) => (
            <li key={index} className="mb-2">{step}</li>
          ))}
        </ol>
      </section>

      <div className="action-buttons flex gap-4 mt-6">
        <Link href={{ pathname: `/cook-mode`, query: { id: selectedRecipe.id } }}>
          <button className="mt-4 p-2 px-6 bg-pink-800/50 border border-sky-50 shadow-lg ring-1 ring-black/5 rounded-full text-sky-50 flex items-center gap-2">
            View in Cook Mode
            <ChefHat className="w-5 h-5" />
          </button>
        </Link>
      </div>
      <Link
        href={{ pathname: `/shopping-list`, query: { id: selectedRecipe.id } }}
        onClick={handleCreateShoppingList}
      >
        <button className="mt-4 p-2 px-6 bg-pink-800/50 border border-sky-50 shadow-lg ring-1 ring-black/5 rounded-full text-sky-50 flex items-center gap-2">
          View Shopping List
          <ShoppingCart className="w-5 h-5" />
        </button>
      </Link>
    </div>
  );
};

export default RecipeDetailsPageWrapper;
