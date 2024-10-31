const getBaseUrl = () => {
  if (typeof window !== 'undefined') return ''; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
}

import { RecipeDocument } from '../../types/RecipeDocument';

export async function getSavedRecipes(userEmail: string): Promise<RecipeDocument[]> {
  const url = `${getBaseUrl()}/api/recipes?userEmail=${encodeURIComponent(userEmail)}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch recipes: ${response.statusText}`);
  }

  return response.json();
}

export async function saveRecipe(userEmail: string, recipe: RecipeDocument): Promise<RecipeDocument> {
  const url = `${getBaseUrl()}/api/recipes`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userEmail, recipe }),
  });

  if (!response.ok) {
    throw new Error(`Failed to save recipe: ${response.statusText}`);
  }

  return response.json();
}

export async function deleteRecipe(id: string, userEmail: string): Promise<{ message: string }> {
  const url = `${getBaseUrl()}/api/recipes?id=${encodeURIComponent(id)}&userEmail=${encodeURIComponent(userEmail)}`;

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete recipe: ${response.statusText}`);
  }

  return response.json();
}
