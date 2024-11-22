// utils/favoriteUtils.ts

// Setting up IndexedDB utilities for storing saved recipes, favorite recipes, and shopping lists offline

const DB_NAME = 'MyChefDB';
const DB_VERSION = 6; // Increment version to ensure all object stores are created
const SAVED_RECIPES_STORE = 'savedRecipes';
const FAVORITES_STORE = 'favoriteRecipes';
const SHOPPING_LISTS_STORE = 'shoppingLists';

// Open IndexedDB connection
export const openDB = (): Promise<IDBDatabase> => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create savedRecipes object store if it doesn't exist
      if (!db.objectStoreNames.contains(SAVED_RECIPES_STORE)) {
        db.createObjectStore(SAVED_RECIPES_STORE, { keyPath: 'recipeId' });
      }

      // Create favoriteRecipes object store if it doesn't exist
      if (!db.objectStoreNames.contains(FAVORITES_STORE)) {
        db.createObjectStore(FAVORITES_STORE, { keyPath: 'recipeId' });
      }

      // Create shoppingLists object store if it doesn't exist
      if (!db.objectStoreNames.contains(SHOPPING_LISTS_STORE)) {
        db.createObjectStore(SHOPPING_LISTS_STORE, { keyPath: 'recipeId' });
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
export const saveRecipeToDB = async (recipe: any): Promise<void> => {
  const db = await openDB();
  const transaction = db.transaction(SAVED_RECIPES_STORE, 'readwrite');
  const store = transaction.objectStore(SAVED_RECIPES_STORE);
  store.put(recipe);

  return new Promise<void>((resolve, reject) => {
    transaction.oncomplete = () => {
      resolve();
    };
    transaction.onerror = () => {
      reject(transaction.error);
    };
  });
};

// Fetch all saved recipes from IndexedDB (savedRecipes)
export const getSavedRecipesFromDB = async (): Promise<any[]> => {
  const db = await openDB();
  const transaction = db.transaction(SAVED_RECIPES_STORE, 'readonly');
  const store = transaction.objectStore(SAVED_RECIPES_STORE);
  const request = store.getAll();

  return new Promise<any[]>((resolve, reject) => {
    request.onsuccess = () => {
      resolve(request.result);
    };
    request.onerror = () => {
      reject(request.error);
    };
  });
};

// Delete a recipe from IndexedDB (savedRecipes)
export const deleteRecipeFromDB = async (recipeId: string): Promise<void> => {
  const db = await openDB();
  const transaction = db.transaction(SAVED_RECIPES_STORE, 'readwrite');
  const store = transaction.objectStore(SAVED_RECIPES_STORE);
  store.delete(recipeId);

  return new Promise<void>((resolve, reject) => {
    transaction.oncomplete = () => {
      resolve();
    };
    transaction.onerror = () => {
      reject(transaction.error);
    };
  });
};

// Save a recipe to Favorites in IndexedDB (favoriteRecipes)
export const saveRecipeToFavorites = async (recipe: any): Promise<void> => {
  const db = await openDB();
  const transaction = db.transaction(FAVORITES_STORE, 'readwrite');
  const store = transaction.objectStore(FAVORITES_STORE);
  store.put(recipe);

  return new Promise<void>((resolve, reject) => {
    transaction.oncomplete = () => {
      resolve();
    };
    transaction.onerror = () => {
      reject(transaction.error);
    };
  });
};

// Fetch all favorite recipes from IndexedDB (favoriteRecipes)
export const getFavoriteRecipesFromDB = async (): Promise<any[]> => {
  const db = await openDB();
  const transaction = db.transaction(FAVORITES_STORE, 'readonly');
  const store = transaction.objectStore(FAVORITES_STORE);
  const request = store.getAll();

  return new Promise<any[]>((resolve, reject) => {
    request.onsuccess = () => {
      resolve(request.result);
    };
    request.onerror = () => {
      reject(request.error);
    };
  });
};

// Delete a recipe from Favorites in IndexedDB (favoriteRecipes)
export const deleteRecipeFromFavorites = async (recipeId: string): Promise<void> => {
  const db = await openDB();
  const transaction = db.transaction(FAVORITES_STORE, 'readwrite');
  const store = transaction.objectStore(FAVORITES_STORE);
  store.delete(recipeId);

  return new Promise<void>((resolve, reject) => {
    transaction.oncomplete = () => {
      resolve();
    };
    transaction.onerror = () => {
      reject(transaction.error);
    };
  });
};

// Save a shopping list to IndexedDB (shoppingLists)
export const saveShoppingListToDB = async (recipeId: string, shoppingList: any): Promise<void> => {
  const db = await openDB();
  const transaction = db.transaction(SHOPPING_LISTS_STORE, 'readwrite');
  const store = transaction.objectStore(SHOPPING_LISTS_STORE);
  store.put({ recipeId, shoppingList });

  return new Promise<void>((resolve, reject) => {
    transaction.oncomplete = () => {
      resolve();
    };
    transaction.onerror = () => {
      reject(transaction.error);
    };
  });
};

// Fetch a shopping list from IndexedDB by recipeId (shoppingLists)
export const getSavedShoppingListFromDB = async (recipeId: string): Promise<any | null> => {
  const db = await openDB();
  const transaction = db.transaction(SHOPPING_LISTS_STORE, 'readonly');
  const store = transaction.objectStore(SHOPPING_LISTS_STORE);
  const request = store.get(recipeId);

  return new Promise<any | null>((resolve, reject) => {
    request.onsuccess = () => {
      resolve(request.result ? request.result.shoppingList : null);
    };
    request.onerror = () => {
      reject(request.error);
    };
  });
};

// Delete a shopping list from IndexedDB by recipeId (shoppingLists)
export const deleteShoppingListFromDB = async (recipeId: string): Promise<void> => {
  const db = await openDB();
  const transaction = db.transaction(SHOPPING_LISTS_STORE, 'readwrite');
  const store = transaction.objectStore(SHOPPING_LISTS_STORE);
  store.delete(recipeId);

  return new Promise<void>((resolve, reject) => {
    transaction.oncomplete = () => {
      resolve();
    };
    transaction.onerror = () => {
      reject(transaction.error);
    };
  });
};
