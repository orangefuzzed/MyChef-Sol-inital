import { Recipe } from './../../types/Recipe';

export const fetchPairings = async (recipe: Recipe): Promise<Recipe[]> => {
  const response = await fetch('/api/pairings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ recipe }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch pairings');
  }

  return response.json();
};
