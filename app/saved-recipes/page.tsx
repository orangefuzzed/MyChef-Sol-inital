'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { RecipeResponse } from '@/types/RecipeResponse'; // Updated import
import RecipeCard from '@/app/components/RecipeCard';

const SavedRecipesPage = () => {
  const [recipes, setRecipes] = useState<RecipeResponse[]>([]); // Updated type
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get('/api/recipes');
        setRecipes(response.data.recipes);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  if (loading) {
    return <div>Loading your saved recipes...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Saved Recipes</h1>
      {recipes.length === 0 ? (
        <p>You have no saved recipes.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} /> // Now correctly recognized
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedRecipesPage;
