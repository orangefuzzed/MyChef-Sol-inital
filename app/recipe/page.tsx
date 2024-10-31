'use client';

import { useSearchParams } from 'next/navigation';

const RecipePage = () => {
  const searchParams = useSearchParams();
  const recipeData = searchParams.get('recipeData');

  if (!recipeData) {
    return <p>No recipe data available</p>;
  }

  const parsedRecipe = JSON.parse(recipeData);

  return (
    <div className="p-8 bg-gray-900 text-white h-screen">
      <h1 className="text-3xl font-bold mb-4">{parsedRecipe.title}</h1>
      <p><strong>Rating:</strong> {parsedRecipe.rating}</p>
      <p><strong>Protein:</strong> {parsedRecipe.protein}</p>
      <p className="mb-4"><strong>Description:</strong> {parsedRecipe.description}</p>

      <h2 className="text-2xl font-bold mb-2">Ingredients</h2>
      <ul className="list-disc list-inside mb-4">
        {parsedRecipe.ingredients.map((ingredient: string, index: number) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>

      <h2 className="text-2xl font-bold mb-2">Instructions</h2>
      <ol className="list-decimal list-inside">
        {parsedRecipe.instructions.map((instruction: string, index: number) => (
          <li key={index} className="mb-2">{instruction}</li>
        ))}
      </ol>
    </div>
  );
};

export default RecipePage;
