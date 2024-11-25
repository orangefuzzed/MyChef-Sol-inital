import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ExternalLinkIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { useRecipeContext } from '../../contexts/RecipeContext';
import { Recipe } from '../../../types/Recipe';
import { generateShoppingList } from '../../utils/shoppingListUtils';

const RecipeDetails: React.FC = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get('id'); // 
  const { selectedRecipe, setSelectedRecipe, setCurrentShoppingList } = useRecipeContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecipe = async () => {
      if (id) {
        try {
          const response = await fetch(`/api/recipes/saved?id=${id}`); // 
          if (response.ok) {
            const fetchedRecipe: Recipe = await response.json();
            setSelectedRecipe(fetchedRecipe);
          } else {
            console.error('No recipe found with the provided ID');
          }
        } catch (error) {
          console.error('Failed to fetch recipe by ID:', error);
        } finally {
          setLoading(false);
        }
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!selectedRecipe) {
    return <div>Recipe not found</div>;
  }

  return (
    <div className="recipe-details-container p-6 bg-gray-800 text-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-4">{selectedRecipe.recipeTitle}</h2>
      <div className="rating text-yellow-400 mb-2">Rating: {selectedRecipe.rating}</div>
      <div className="protein text-gray-400 mb-4">Protein: {selectedRecipe.protein}</div>

      <section className="ingredients mb-6">
        <h3 className="text-2xl font-semibold mb-2">Ingredients</h3>
        <ul className="list-disc list-inside">
          {selectedRecipe.ingredients.map((ingredient, index) => (
            <li key={index}>{typeof ingredient === 'string' ? ingredient : ingredient.name}</li>
          ))}
        </ul>
      </section>

      <section className="instructions mb-6">
        <h3 className="text-2xl font-semibold mb-2">Instructions</h3>
        <ol className="list-decimal list-inside">
          {selectedRecipe.instructions.map((step, index) => (
            <li key={index} className="mb-2">{step}</li>
          ))}
        </ol>
      </section>

      <div className="action-buttons flex gap-4 mt-6">
        <Link href={{ pathname: `/cook-mode`, query: { id: selectedRecipe.id } }}> {/* Updated recieId to id */}
          <button className="p-2 px-6 bg-blue-600 text-white rounded-full flex items-center gap-2">
            View in Cook Mode
            <ExternalLinkIcon className="w-5 h-5" />
          </button>
        </Link>
        <Link
          href={{ pathname: `/shopping-list`, query: { id: selectedRecipe.id } }} // Updated recpeId to id
          onClick={handleCreateShoppingList}
        >
          <button className="p-2 px-6 bg-green-600 text-white rounded-full flex items-center gap-2">
            View Shopping List RecipeDetails
            <ExternalLinkIcon className="w-5 h-5" />
          </button>
        </Link>
        <button onClick={() => window.history.back()} className="p-2 px-6 bg-gray-700 text-white rounded-full">
          Back to Suggestions
        </button>
      </div>
    </div>
  );
};

export default RecipeDetails;
