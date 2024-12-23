// utils/shoppingListUtils.ts

import { Recipe } from '../../types/Recipe';
import { ShoppingListItem } from '../../types/ShoppingListItem';
import { ShoppingList } from '../../types/ShoppingList';

const DB_NAME = 'MyChefDB';
const DB_VERSION = 7; // Updated version to reflect new shopping list features
const SHOPPING_LISTS_STORE = 'shoppingLists';

// Open IndexedDB connection for Shopping Lists
export const openShoppingListDB = (): Promise<IDBDatabase> => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create shoppingLists object store if it doesn't exist
      if (!db.objectStoreNames.contains(SHOPPING_LISTS_STORE)) {
        db.createObjectStore(SHOPPING_LISTS_STORE, { keyPath: 'id' });
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

// Generate shopping list from a recipe
export const generateShoppingList = (recipe: Recipe): { ingredients: ShoppingListItem[], totalItems: number } => {
  return {
    ingredients: recipe.ingredients.map((ingredient) => {
      // If the ingredient is an object with name, quantity, and unit, use that
      if (typeof ingredient === 'object' && ingredient !== null && 'name' in ingredient) {
        return ingredient as ShoppingListItem; // Cast to ShoppingListItem
      }

      // If the ingredient is just a string, return it with a default quantity and unit
      return {
        name: ingredient as string,
        /*quantity: 1, // Default quantity
        unit: 'unit',*/ // Default unit
      };
    }),
    totalItems: recipe.ingredients.length,
  };
};

// Save a shopping list to IndexedDB
export const saveShoppingListToDB = async (
  id: string,
  shoppingList: { ingredients: ShoppingListItem[], totalItems: number },
  recipeTitle: string
): Promise<void> => {
  const db = await openShoppingListDB();
  const transaction = db.transaction(SHOPPING_LISTS_STORE, 'readwrite');
  const store = transaction.objectStore(SHOPPING_LISTS_STORE);
  store.put({ id, shoppingList, recipeTitle });  // Add recipeTitle here

  return new Promise<void>((resolve, reject) => {
    transaction.oncomplete = () => {
      resolve();
    };
    transaction.onerror = () => {
      reject(transaction.error);
    };
  });
};
;

// Fetch a shopping list from IndexedDB by recipeId
export const getSavedShoppingListsFromDB = async (id: string): Promise<{ ingredients: ShoppingListItem[], totalItems: number } | null> => {
  const db = await openShoppingListDB();
  const transaction = db.transaction(SHOPPING_LISTS_STORE, 'readonly');
  const store = transaction.objectStore(SHOPPING_LISTS_STORE);
  const request = store.get(id);

  return new Promise<{ ingredients: ShoppingListItem[], totalItems: number } | null>((resolve, reject) => {
    request.onsuccess = () => {
      resolve(request.result ? request.result.shoppingList : null);
    };
    request.onerror = () => {
      reject(request.error);
    };
  });
};

// Fetch all saved shopping lists from IndexedDB
export const getAllSavedShoppingListsFromDB = async (): Promise<ShoppingList[] | null> => {
  const db = await openShoppingListDB();
  const transaction = db.transaction(SHOPPING_LISTS_STORE, 'readonly');
  const store = transaction.objectStore(SHOPPING_LISTS_STORE);
  const request = store.getAll();

  return new Promise<ShoppingList[] | null>((resolve, reject) => {
    request.onsuccess = () => {
      resolve(request.result as ShoppingList[]);
    };
    request.onerror = () => {
      reject(request.error);
    };
  });
};


// Delete a shopping list from IndexedDB by recipeId
export const deleteShoppingListFromDB = async (id: string): Promise<void> => {
  const db = await openShoppingListDB();
  const transaction = db.transaction(SHOPPING_LISTS_STORE, 'readwrite');
  const store = transaction.objectStore(SHOPPING_LISTS_STORE);
  store.delete(id);

  return new Promise<void>((resolve, reject) => {
    transaction.oncomplete = () => {
      resolve();
    };
    transaction.onerror = () => {
      reject(transaction.error);
    };
  });
};
