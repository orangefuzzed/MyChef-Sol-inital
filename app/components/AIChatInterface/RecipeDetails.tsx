// RecipeDetails.tsx - Updated for Suspense and Loading Component
import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useRecipeContext } from '../../contexts/RecipeContext';
import { Recipe } from '../../../types/Recipe';
import { generateShoppingList } from '../../utils/shoppingListUtils';
import { BookHeart, Check, Flame, Clock, Soup, ShoppingCart, ChefHat, Bookmark, Heart, Croissant } from 'lucide-react';
import Loading from '../../loading'; // Use your existing Loading component
import { saveRecipeToDB, deleteRecipeFromDB, getSavedRecipesFromDB } from '../../utils/indexedDBUtils';
import { saveRecipeToFavorites, deleteRecipeFromFavorites, getFavoriteRecipesFromDB } from '../../utils/favoritesUtils';
import Toast from '../../components/Toast'; // Import your Toast component
import GetStartedModal from '../GetStartedModal';
import * as Checkbox from '@radix-ui/react-checkbox';

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
  const [isSaved, setIsSaved] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isCategorized, setIsCategorized] = useState(false);
  const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  // Update triggerToast:
  const triggerToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

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

  useEffect(() => {
    if (!id) return; // Add null check for `id`

    const checkIfSaved = async () => {
      const savedRecipes = await getSavedRecipesFromDB();
      const found = savedRecipes.find((recipe) => recipe.id === id);
      setIsSaved(!!found);
    };

    const checkIfFavorited = async () => {
      const favoriteRecipes = await getFavoriteRecipesFromDB();
      const found = favoriteRecipes.find((recipe) => recipe.id === id);
      setIsFavorited(!!found);
    };

    checkIfSaved();
    checkIfFavorited();
  }, [id]);


  // On Component Mount: Check if Recipe is Categorized
  useEffect(() => {
    if (!selectedRecipe?.id) return;

    const checkIfCategorized = async () => {
      console.log(`Fetching category for recipe ID: ${selectedRecipe.id}`);
      try {
        const response = await fetch(
          `/api/recipes/categories?recipeId=${selectedRecipe.id}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch category');
        }

        const data = await response.json();
        console.log('Category data fetched:', data);

        if (data?.mainCategory) {
          setIsCategorized(true);
          setSelectedCategory(data.mainCategory); // Pre-select the current category
          console.log(`Recipe categorized: ${data.mainCategory}`);
        } else {
          setIsCategorized(false);
          setSelectedCategory(''); // Default to empty // Reset to default
          console.log('Recipe not categorized');
        }
      } catch (error) {
        console.error('Error checking if recipe is categorized:', error);
      }
    };

    checkIfCategorized();
  }, [selectedRecipe]);

  useEffect(() => {
    if (!id) {
      console.error('No ID found in query params!');
    } else {
      console.log(`Fetched recipe ID: ${id}`);
    }
  }, [id]);

  const handleSaveToggle = async () => {
    if (!selectedRecipe || !id) return; // Ensure `id` is not null before proceeding

    try {
      if (isSaved) {
        await deleteRecipeFromDB(id);
        setIsSaved(false);
        triggerToast('Recipe successfully removed from saved recipes!', 'success');
        const response = await fetch(`/api/recipes/saved?id=${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          console.error('Failed to delete recipe from MongoDB:', await response.text());
        }
      } else {
        await saveRecipeToDB(selectedRecipe);
        setIsSaved(true);
        triggerToast('Recipe successfully saved!', 'success');
        const response = await fetch('/api/recipes/saved', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(selectedRecipe),
        });
        if (!response.ok) {
          console.error('Failed to save recipe to MongoDB:', await response.text());
        }
      }
    } catch (error) {
      console.error('Error while toggling save:', error);
      triggerToast('Failed to save the recipe. Please try again.', 'error');
    }
  };

  const handleFavoriteToggle = async () => {
    if (!selectedRecipe || !id) return; // Ensure `id` is not null before proceeding

    try {
      if (isFavorited) {
        await deleteRecipeFromFavorites(id);
        setIsFavorited(false);
        triggerToast('Recipe successfully removed from favorites!', 'success');
        const response = await fetch(`/api/recipes/favorites?id=${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          console.error('Failed to delete favorite from MongoDB:', await response.text());
        }
      } else {
        await saveRecipeToFavorites(selectedRecipe);
        setIsFavorited(true);
        triggerToast('Recipe successfully added to favorites!', 'success');
        const response = await fetch('/api/recipes/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(selectedRecipe),
        });
        if (!response.ok) {
          console.error('Failed to save favorite to MongoDB:', await response.text());
        }
      }
    } catch (error) {
      console.error('Error while toggling favorite:', error);
      triggerToast('Failed to favorite the recipe. Please try again.', 'error');
    }
  };

  const handleCreateShoppingList = () => {
    if (selectedRecipe) {
      const shoppingList = generateShoppingList(selectedRecipe);
      setCurrentShoppingList(shoppingList);
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRecipe?.id || !selectedCategory) {
      triggerToast(
        'Failed to save category. Recipe ID or Category is missing.',
        'error'
      );
      return;
    }

    try {
      const response = await fetch(`/api/recipes/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipeId: selectedRecipe.id,
          mainCategory: selectedCategory,
          subCategory: null, // Optional for now
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save category.');
      }

      setIsCategorized(true); // Ensure the icon updates
      triggerToast(
        `Recipe successfully added to '${selectedCategory}'!`,
        'success'
      );

      setCategoryModalOpen(false); // Close modal after saving
    } catch (error) {
      console.error('Error saving category:', error);
      triggerToast('Failed to save category. Please try again.', 'error');
    }
  };

  const categoryOptions = [
    "Main Dishes",
    "Side Dishes",
    "Soup & Salads",
    "Desserts",
    "Appetizers",
    "Beverages",
    "Breakfast",
    "Lunch",
    "Dinner",
    "Snacks",
    "Holiday & Seasonal",
    "Uncategorized",
  ];


  // Show loading state if still fetching
  if (loading) {
    return <Loading />;
  }

  if (!selectedRecipe) {
    return <div className="text-white p-4">Recipe not found. Please go back and select a recipe.</div>;
  }

  return (
    <div className="recipe-details-container bg-white/30 backdrop-blur-lg border-white border shadow-lg ring-1 ring-black/5 p-6 rounded-2xl">

      {/* Save, MyCookBook and Favorite Toggles */}
      <div className="flex justify-start gap-2 mb-2">
        <button onClick={handleSaveToggle} className="p-2 text-sky-50 hover:text-pink-800">
          <Bookmark strokeWidth={1.5} size={24} color={isSaved ? '#9d174d' : 'white'} />
        </button>
        <button onClick={handleFavoriteToggle} className="p-2 text-sky-50 hover:text-pink-800">
          <Heart strokeWidth={1.5} size={24} color={isFavorited ? '#9d174d' : 'white'} />
        </button>

        {/* Open Modal for Category Selection */}
        <button
          onClick={() => setCategoryModalOpen(true)}
          className="p-2 text-sky-50 hover:text-pink-800"
        >
          <BookHeart
            strokeWidth={1.5}
            size={24}
            color={isCategorized ? '#9d174d' : 'white'} // Reflect category state
          />
        </button>

        {/* Toast Messages */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
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
          <span> {selectedRecipe.cookTime}</span>
        </div>
        <div className="flex flex-col items-center text-xs text-black">
          <Soup className="w-5 h-5 text-pink-800 mb-1" />
          <span> {selectedRecipe.protein} protein</span>
        </div>
        <div className="flex flex-col items-center text-xs text-black">
          <Croissant className="w-5 h-5 text-pink-800 mb-1" />
          <span> {selectedRecipe.carbs} carbs</span>
        </div>
      </div>

      <section className="ingredients mb-6">
        <h3 className="text-2xl text-black font-semibold mb-2">Ingredients</h3>
        <Link
          href={{ pathname: `/shopping-list`, query: { id: selectedRecipe.id } }}
          onClick={handleCreateShoppingList}
        >
          <button className="text-sm mt-1 mb-2 px-4 py-1 bg-[#00a39e]/40 border border-sky-50 shadow-lg ring-1 ring-black/5 rounded-full text-sky-50 flex items-center gap-2">
            View Shopping List
            <ShoppingCart strokeWidth={1.5} size={18} className="" />
          </button>
        </Link>
        <ul className="list-disc list-inside">
          {selectedRecipe.ingredients.map((ingredient, index) => (
            <li key={index}>{typeof ingredient === 'string' ? ingredient : ingredient.name}</li>
          ))}
        </ul>
      </section>

      <section className="instructions mb-6">
        <h3 className="text-2xl text-black font-semibold mb-2">Instructions</h3>
        <Link href={{ pathname: `/cook-mode`, query: { id: selectedRecipe.id } }}>
          <button className="text-sm mt-1 mb-2 px-4 py-1 bg-[#00a39e]/40 border border-sky-50 shadow-lg ring-1 ring-black/5 rounded-full text-sky-50 flex items-center gap-2">
            View in Cook Mode
            <ChefHat strokeWidth={1.5} size={18} className="" />
          </button>
        </Link>
        <ol className="list-decimal list-inside">
          {selectedRecipe.instructions.map((step, index) => (
            <li key={index} className="mb-2">{step}</li>
          ))}
        </ol>
      </section>

      {/* Modal for Selecting Categories */}
      {isCategoryModalOpen && (
        <GetStartedModal
          isOpen={isCategoryModalOpen}
          onClose={() => setCategoryModalOpen(false)}
          currentSlideIndex={0}
          onNext={() => { }} // No-op for 'next'
          onPrev={() => { }} // No-op for 'prev'
          slides={[
            {
              title: 'Add to MyDishcoveries:',
              content: (
                <form
                  onSubmit={handleSaveCategory}
                  className="space-y-3 p-2"
                >
                  <div className="mb-4 space-y-4">
                    {categoryOptions.map((category) => (
                      <div key={category} className="flex items-center space-x-4">
                        <Checkbox.Root
                          id={category}
                          checked={selectedCategory === category}
                          onCheckedChange={() => setSelectedCategory(category)}
                          className="w-5 h-5 bg-gray-700 rounded-md flex items-center justify-center border border-gray-500 focus:outline-none focus:ring focus:ring-[#00a39e]"
                        >
                          <Checkbox.Indicator>
                            <Check className="w-4 h-4 text-[#00a39e]" />
                          </Checkbox.Indicator>
                        </Checkbox.Root>
                        <label htmlFor={category} className="text-gray-300">
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#00a39e]/50 border border-sky-50 text-white p-2 rounded-full shadow-md hover:bg-pink-800/50"
                  >
                    Update
                  </button>
                </form>
              ),
            },
          ]}
        />
      )}
    </div>
  );
};

export default RecipeDetailsPageWrapper;
