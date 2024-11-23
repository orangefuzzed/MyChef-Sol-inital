import React, { useState } from 'react';
import { Recipe } from '../../types/Recipe';
import { useRecipeContext } from './../contexts/RecipeContext';

interface RecipeSuggestionsProps {
  recipes: Recipe[];
  onSelect: (recipe: Recipe) => void;
}

const RecipeSuggestions: React.FC<RecipeSuggestionsProps> = ({ recipes, onSelect }) => {
  const { setSelectedRecipe } = useRecipeContext();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentRecipeIndex, setCurrentRecipeIndex] = useState<number | null>(null);

  const handleViewRecipe = (index: number) => {
    setCurrentRecipeIndex(index);
    setIsModalOpen(true);
  };

  const handleConfirmSelection = () => {
    if (currentRecipeIndex !== null) {
      const selectedRecipe = recipes[currentRecipeIndex];
      onSelect(selectedRecipe);
      setSelectedRecipe(selectedRecipe); // Persist selection in RecipeContext
    }
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentRecipeIndex(null);
  };

  const goToNextRecipe = () => {
    if (currentRecipeIndex !== null && currentRecipeIndex < recipes.length - 1) {
      setCurrentRecipeIndex(currentRecipeIndex + 1);
    }
  };

  const goToPreviousRecipe = () => {
    if (currentRecipeIndex !== null && currentRecipeIndex > 0) {
      setCurrentRecipeIndex(currentRecipeIndex - 1);
    }
  };

  return (
    <div className="recipe-suggestions grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {recipes.map((recipe, index) => (
        <div key={recipe.recipeId} className="recipe-card bg-gray-800 p-4 rounded-lg">
          <h3 className="text-xl font-bold mb-2">{recipe.recipeTitle}</h3>
          <p className="text-sm mb-2">{recipe.description}</p>
          {recipe.imageURL && (
            <img src={recipe.imageURL} alt={recipe.recipeTitle} className="mb-2 rounded" />
          )}
          <button
            onClick={() => handleViewRecipe(index)}
            className="mt-2 p-2 bg-blue-500 rounded-full text-white"
          >
            View Recipe
          </button>
        </div>
      ))}

      {/* Modal for viewing the full recipe 
      {isModalOpen && currentRecipeIndex !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white text-black p-6 rounded-lg w-11/12 md:w-2/3 lg:w-1/2">
            <h2 className="text-2xl font-bold mb-4">{recipes[currentRecipeIndex].recipeTitle}</h2>
            <p className="mb-2">{recipes[currentRecipeIndex].description}</p>
            {recipes[currentRecipeIndex].ingredients && (
              <>
                <h3 className="text-xl font-bold mt-4">Ingredients:</h3>
                <ul className="list-disc pl-5 mb-4">
                  {recipes[currentRecipeIndex].ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </>
            )}
            {recipes[currentRecipeIndex].instructions && (
              <>
                <h3 className="text-xl font-bold mt-4">Instructions:</h3>
                <ol className="list-decimal pl-5 mb-4">
                  {recipes[currentRecipeIndex].instructions.map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                  ))}
                </ol>
              </>
            )}
            <div className="flex justify-between mt-6 gap-2">
              <button
                onClick={goToPreviousRecipe}
                className="p-2 bg-blue-500 rounded-full text-white"
                disabled={currentRecipeIndex === 0}
              >
                Previous
              </button>
              <button
                onClick={handleConfirmSelection}
                className="p-2 bg-green-500 rounded-full text-white"
              >
                Confirm Selection
              </button>
              <button
                onClick={goToNextRecipe}
                className="p-2 bg-blue-500 rounded-full text-white"
                disabled={currentRecipeIndex === recipes.length - 1}
              >
                Next
              </button>
            </div>
            <button
              onClick={handleCloseModal}
              className="mt-4 p-2 bg-red-500 rounded-full text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}*/}
    </div>
  );
};

export default RecipeSuggestions;
