import { getSavedRecipesFromDB } from './indexedDBUtils';
import { getFavoriteRecipesFromDB } from './favoritesUtils';
import { getAllSavedShoppingListsFromDB } from './shoppingListUtils';
import { getChatMessagesFromDB, deleteChatMessageFromDB } from './indexedDBUtils';
import { getSavedSessionsFromDB, deleteChatSessionFromDB } from './indexedDBUtils';

// Utility to check if we are online
const isOnline = (): boolean => typeof window !== 'undefined' && window.navigator.onLine;

// Sync saved sessions from IndexedDB to MongoDB
export const syncPendingSessions = async () => {
  if (!isOnline()) return;

  try {
    const pendingSessions = await getSavedSessionsFromDB();
    for (const session of pendingSessions) {
      // Sync each session to MongoDB
      const response = await fetch('/api/sessions/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(session),
      });

      if (response.ok) {
        console.log(`Session ${session.sessionId} synced to MongoDB.`);
        await deleteChatSessionFromDB(session.sessionId); // Remove from IndexedDB once successfully synced
      } else {
        console.error(`Failed to sync session ${session.sessionId}`);
      }
    }
  } catch (error) {
    console.error('Error syncing sessions:', error);
  }
};

// Add event listeners to manage online/offline behavior
export const setupSyncManager = () => {
  if (typeof window !== 'undefined') {
    window.addEventListener('online', syncPendingSessions);
  }
};

// Sync saved recipes from IndexedDB to MongoDB
export const syncRecipesWithMongoDB = async () => {
  if (!isOnline()) return;

  try {
    const savedRecipes = await getSavedRecipesFromDB();
    if (savedRecipes.length === 0) return;

    const response = await fetch('/api/recipes/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ recipes: savedRecipes }),
    });

    if (!response.ok) {
      console.error('Failed to sync recipes:', await response.text());
    } else {
      console.log('Recipes synced successfully');
    }
  } catch (error) {
    console.error('Error during recipe sync:', error);
  }
};

// Sync favorite recipes from IndexedDB to MongoDB
export const syncFavoritesWithMongoDB = async () => {
  if (!isOnline()) return;

  try {
    const favoriteRecipes = await getFavoriteRecipesFromDB();
    if (favoriteRecipes.length === 0) return;

    const response = await fetch('/api/recipes/favorites/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ favorites: favoriteRecipes }),
    });

    if (!response.ok) {
      console.error('Failed to sync favorite recipes:', await response.text());
    } else {
      console.log('Favorite recipes synced successfully');
    }
  } catch (error) {
    console.error('Error during favorite recipes sync:', error);
  }
};

// Sync shopping lists from IndexedDB to MongoDB
export const syncShoppingListsWithMongoDB = async () => {
  if (!isOnline()) return;

  try {
    const shoppingLists = await getAllSavedShoppingListsFromDB();
    if (!shoppingLists || shoppingLists.length === 0) return;

    const response = await fetch('/api/shopping-lists/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ shoppingLists }),
    });

    if (!response.ok) {
      console.error('Failed to sync shopping lists:', await response.text());
    } else {
      console.log('Shopping lists synced successfully');
    }
  } catch (error) {
    console.error('Error during shopping lists sync:', error);
  }
};

// Sync chat messages from IndexedDB to MongoDB
export const syncChatMessagesWithMongoDB = async () => {
  if (!isOnline()) return;

  try {
    const chatMessages = await getChatMessagesFromDB();
    if (chatMessages.length === 0) return;

    const response = await fetch('/api/chat/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages: chatMessages }),
    });

    if (!response.ok) {
      console.error('Failed to sync chat messages:', await response.text());
    } else {
      console.log('Chat messages synced successfully');

      // Delete successfully synced messages from IndexedDB synchronously
      for (const message of chatMessages) {
        await deleteChatMessageFromDB(message.messageId);
      }
    }
  } catch (error) {
    console.error('Error during chat message sync:', error);
  }
};

// Register event listener for going online to trigger the sync
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    syncRecipesWithMongoDB();
    syncFavoritesWithMongoDB();
    syncShoppingListsWithMongoDB();
    syncChatMessagesWithMongoDB(); // Add chat sync to the list of functions
    syncPendingSessions(); // Sync chat sessions
  });
}
