import { Recipe } from '../../types/Recipe'; // Assuming Recipe type is defined here

// Setting up IndexedDB utilities for storing saved recipes, favorite recipes, and shopping lists offline

const DB_NAME = 'MyChefDB';
const DB_VERSION = 10; // Increment version to ensure all object stores are created
const SAVED_RECIPES_STORE = 'savedRecipes';
const FAVORITES_STORE = 'favoriteRecipes';
const SHOPPING_LISTS_STORE = 'shoppingLists';

// Store configuration for 'savedSessions'
const SAVED_SESSIONS_STORE = { name: 'savedSessions', keyPath: 'sessionId', autoIncrement: false };

// Store configuration for 'chatMessages'
const CHAT_STORE_NAME = { name: 'chatMessages', keyPath: 'messageId', autoIncrement: false };

// Open IndexedDB connection
export const openDB = (): Promise<IDBDatabase> => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create savedRecipes object store if it doesn't exist
      if (!db.objectStoreNames.contains(SAVED_RECIPES_STORE)) {
        db.createObjectStore(SAVED_RECIPES_STORE, { keyPath: 'id' });
      }

      // Create favoriteRecipes object store if it doesn't exist
      if (!db.objectStoreNames.contains(FAVORITES_STORE)) {
        db.createObjectStore(FAVORITES_STORE, { keyPath: 'id' });
      }

      // Create shoppingLists object store if it doesn't exist
      if (!db.objectStoreNames.contains(SHOPPING_LISTS_STORE)) {
        db.createObjectStore(SHOPPING_LISTS_STORE, { keyPath: 'id' });
      }

      // Create the 'savedSessions' store with specific key path and no auto-increment
      if (!db.objectStoreNames.contains(SAVED_SESSIONS_STORE.name)) {
        db.createObjectStore(SAVED_SESSIONS_STORE.name, { keyPath: SAVED_SESSIONS_STORE.keyPath });
      }

      // Add the 'chatMessages' store with specific key path and no auto-increment
      if (!db.objectStoreNames.contains(CHAT_STORE_NAME.name)) {
        db.createObjectStore(CHAT_STORE_NAME.name, { keyPath: CHAT_STORE_NAME.keyPath });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
};

// Save a recipe to IndexedDB (savedRecipes)
export const saveRecipeToDB = async (recipe: Recipe): Promise<void> => {
  try {
    const db = await openDB();
    const transaction = db.transaction(SAVED_RECIPES_STORE, 'readwrite');
    const store = transaction.objectStore(SAVED_RECIPES_STORE);

    await new Promise<void>((resolve, reject) => {
      const request = store.put(recipe);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error saving recipe to IndexedDB:', error);
  }
};

// Fetch all saved recipes from IndexedDB (savedRecipes)
export const getSavedRecipesFromDB = async (): Promise<Recipe[]> => {
  try {
    const db = await openDB();
    const transaction = db.transaction(SAVED_RECIPES_STORE, 'readonly');
    const store = transaction.objectStore(SAVED_RECIPES_STORE);

    return new Promise<Recipe[]>((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result as Recipe[]);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error fetching saved recipes from IndexedDB:', error);
    return [];
  }
};

// Delete a recipe from IndexedDB (savedRecipes)
export const deleteRecipeFromDB = async (id: string): Promise<void> => {
  try {
    const db = await openDB();
    const transaction = db.transaction(SAVED_RECIPES_STORE, 'readwrite');
    const store = transaction.objectStore(SAVED_RECIPES_STORE);

    await new Promise<void>((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error deleting recipe from IndexedDB:', error);
  }
};

// Save a recipe to Favorites in IndexedDB (favoriteRecipes)
export const saveRecipeToFavorites = async (recipe: Recipe): Promise<void> => {
  try {
    const db = await openDB();
    const transaction = db.transaction(FAVORITES_STORE, 'readwrite');
    const store = transaction.objectStore(FAVORITES_STORE);

    await new Promise<void>((resolve, reject) => {
      const request = store.put(recipe);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error saving recipe to favorites:', error);
  }
};

// Fetch all favorite recipes from IndexedDB (favoriteRecipes)
export const getFavoriteRecipesFromDB = async (): Promise<Recipe[]> => {
  try {
    const db = await openDB();
    const transaction = db.transaction(FAVORITES_STORE, 'readonly');
    const store = transaction.objectStore(FAVORITES_STORE);

    return new Promise<Recipe[]>((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result as Recipe[]);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error fetching favorite recipes from IndexedDB:', error);
    return [];
  }
};

// Delete a recipe from Favorites in IndexedDB (favoriteRecipes)
export const deleteRecipeFromFavorites = async (id: string): Promise<void> => {
  try {
    const db = await openDB();
    const transaction = db.transaction(FAVORITES_STORE, 'readwrite');
    const store = transaction.objectStore(FAVORITES_STORE);

    await new Promise<void>((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error deleting recipe from favorites:', error);
  }
};
