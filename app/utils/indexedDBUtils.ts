import { ChatSession } from '../../types/ChatSession'; // Importing ChatSession type
import { ChatMessage } from '../../types/ChatMessage';
import { Recipe } from '../../types/Recipe'; // Assuming Recipe type is defined here

const DB_NAME = 'MyChefDB';
const DB_VERSION = 10; // Updated version to match and reflect changes

// Store names that use simple configurations
const STORE_NAMES = ['savedRecipes', 'favoriteRecipes', 'shoppingLists', 'recipeSuggestions', 'recipeCategories'];

// Store configuration for 'savedSessions'
const SAVED_SESSIONS_STORE = { name: 'savedSessions', keyPath: 'sessionId', autoIncrement: false };

// Store configuration for 'chatMessages'
const CHAT_STORE_NAME = { name: 'chatMessages', keyPath: 'messageId', autoIncrement: false };


export const openDBWithChat = (): Promise<IDBDatabase> => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create basic stores with default key paths
      STORE_NAMES.forEach((storeName) => {
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
        }
      });

      // Create the 'savedSessions' store with specific key path and no auto-increment
      if (!db.objectStoreNames.contains(SAVED_SESSIONS_STORE.name)) {
        db.createObjectStore(SAVED_SESSIONS_STORE.name, { keyPath: SAVED_SESSIONS_STORE.keyPath });
      }

      // Add the 'chatMessages' store with specific key path and no auto-increment
      if (!db.objectStoreNames.contains(CHAT_STORE_NAME.name)) {
        db.createObjectStore(CHAT_STORE_NAME.name, { keyPath: CHAT_STORE_NAME.keyPath });
      }

      // If 'recipeCategories' store doesn't exist, create it
      if (!db.objectStoreNames.contains('recipeCategories')) {
        const store = db.createObjectStore('recipeCategories', {
          keyPath: '_id',
        });
        // For queries by userEmail, category, etc.:
        store.createIndex('userEmail', 'userEmail', { unique: false });
        store.createIndex('mainCategory', 'mainCategory', { unique: false });
        // You could also create an index on recipeId if you want
      }
    };

    request.onsuccess = () => {
      const db = request.result;

      if (!db) {
        console.error('IndexedDB connection failed: database is null');
        reject(new Error('Failed to open IndexedDB connection.'));
      } else {
        resolve(db);
      }
    };

    request.onerror = () => {
      console.error('Error opening IndexedDB:', request.error);
      reject(request.error);
    };
  });
};

export interface CategoryRecord {
  _id: string;        // e.g. "user@example.com_Main Dishes_recipeId123"
  userEmail: string;
  mainCategory: string;
  recipeId: string;
  recipeTitle?: string;
  // any other fields you want stored locally
}
export type MinimalCategoryRecipe = {
  id: string;             // the unique recipe id
  recipeTitle?: string;   // optional for display offline
  // any other minimal fields
};


export async function saveRecipeToCategory(
  userEmail: string,
  mainCategory: string,
  recipe: MinimalCategoryRecipe
): Promise<void> {
  // 1. Open DB
  const db = await openDBWithChat();
  const transaction = db.transaction('recipeCategories', 'readwrite');
  const store = transaction.objectStore('recipeCategories');

  // 2. Build unique key for this record
  const _id = `${userEmail}_${mainCategory}_${recipe.id}`;

  // 3. Create a CategoryRecord to store
  const record: CategoryRecord = {
    _id,
    userEmail,
    mainCategory,
    recipeId: recipe.id,
    recipeTitle: recipe.recipeTitle ?? '',  // optional
  };

  // 4. Upsert into IndexedDB
  store.put(record); 

  // 5. Return a Promise that resolves/rejects based on transaction success
  return new Promise<void>((resolve, reject) => {
    transaction.oncomplete = () => {
      console.log(`[saveRecipeToCategory] Successfully saved to category: ${mainCategory}`);
      resolve();
    };

    transaction.onerror = () => {
      console.error('[saveRecipeToCategory] Error:', transaction.error);
      reject(transaction.error);
    };
  });
}

export async function deleteRecipeFromCategory(
  userEmail: string,
  mainCategory: string,
  recipeId: string
): Promise<void> {
  const db = await openDBWithChat();
  const transaction = db.transaction('recipeCategories', 'readwrite');
  const store = transaction.objectStore('recipeCategories');

  const _id = `${userEmail}_${mainCategory}_${recipeId}`;
  store.delete(_id);

  return new Promise<void>((resolve, reject) => {
    transaction.oncomplete = () => {
      console.log(`[deleteRecipeFromCategory] Successfully removed from ${mainCategory}`);
      resolve();
    };
    transaction.onerror = () => {
      console.error('[deleteRecipeFromCategory] Error:', transaction.error);
      reject(transaction.error);
    };
  });
}

export async function getAllCategoriesFromDB(): Promise<CategoryRecord[]> {
  const db = await openDBWithChat();
  const transaction = db.transaction('recipeCategories', 'readonly');
  const store = transaction.objectStore('recipeCategories');
  const request = store.getAll();

  return new Promise<CategoryRecord[]>((resolve, reject) => {
    request.onsuccess = () => {
      const data = request.result as CategoryRecord[];
      resolve(data);
    };
    request.onerror = () => {
      reject(request.error);
    };
  });
}

/**
 * Return all category records for a specific user & mainCategory.
 */
export async function getRecipesForCategory(
  userEmail: string,
  mainCategory: string
): Promise<CategoryRecord[]> {
  const db = await openDBWithChat();
  const transaction = db.transaction('recipeCategories', 'readonly');
  const store = transaction.objectStore('recipeCategories');
  const index = store.index('mainCategory');

  // We'll filter on userEmail in code or create a compound index. 
  // For simplicity, let's do it in code after we fetch by mainCategory.
  const request = index.getAll(mainCategory);

  return new Promise<CategoryRecord[]>((resolve, reject) => {
    request.onsuccess = () => {
      const data = (request.result as CategoryRecord[]).filter(
        (rec) => rec.userEmail === userEmail
      );
      resolve(data);
    };
    request.onerror = () => {
      reject(request.error);
    };
  });
}

// Save a session to IndexedDB
export const saveSessionToDB = async (session: ChatSession): Promise<void> => {
  console.log('[saveSessionToDB] Attempting to save session to IndexedDB:', session);

  const db = await openDBWithChat();
  const transaction = db.transaction('savedSessions', 'readwrite');
  const store = transaction.objectStore('savedSessions');

  // Log key property to verify it's set correctly
  console.log('[saveSessionToDB] Key Path (sessionId):', session.sessionId);

  store.put(session); // Save the session object to IndexedDB

  return new Promise<void>((resolve, reject) => {
    transaction.oncomplete = () => {
      console.log('[saveSessionToDB] IndexedDB transaction completed successfully');
      resolve();
    };
    transaction.onerror = () => {
      console.error('[saveSessionToDB] IndexedDB transaction failed:', transaction.error);
      reject(transaction.error);
    };
  });
};

// Save a recipe to IndexedDB
export const saveRecipeToDB = async (recipe: Recipe): Promise<void> => {
  const db = await openDBWithChat();
  const transaction = db.transaction('savedRecipes', 'readwrite');
  const store = transaction.objectStore('savedRecipes');

  console.log('[saveRecipeToDB] Saving recipe to IndexedDB:', recipe);
  
  store.put(recipe);

  return new Promise<void>((resolve, reject) => {
    transaction.oncomplete = () => {
      console.log('[saveRecipeToDB] Recipe saved successfully');
      resolve();
    };
    transaction.onerror = () => {
      console.error('[saveRecipeToDB] Error saving recipe:', transaction.error);
      reject(transaction.error);
    };
  });
};

// Fetch all chat messages from IndexedDB
export const getChatMessagesFromDB = async (): Promise<ChatMessage[]> => {
  const db = await openDBWithChat();
  const transaction = db.transaction(CHAT_STORE_NAME.name, 'readonly');
  const store = transaction.objectStore(CHAT_STORE_NAME.name);
  const request = store.getAll();

  return new Promise<ChatMessage[]>((resolve, reject) => {
    request.onsuccess = () => {
      resolve(request.result as ChatMessage[]);
    };
    request.onerror = () => {
      reject(request.error);
    };
  });
};

// Fetch all saved sessions from IndexedDB
export const getSavedSessionsFromDB = async (): Promise<ChatSession[]> => {
  const db = await openDBWithChat();
  const transaction = db.transaction('savedSessions', 'readonly');
  const store = transaction.objectStore('savedSessions');
  const request = store.getAll();

  return new Promise<ChatSession[]>((resolve, reject) => {
    request.onsuccess = () => {
      resolve(request.result as ChatSession[]);
    };
    request.onerror = () => {
      reject(request.error);
    };
  });
};

// Retrieve pending recipes from IndexedDB
export const getPendingRecipes = async (): Promise<Recipe[]> => {
  const db = await openDBWithChat();
  const transaction = db.transaction('savedRecipes', 'readonly');
  const store = transaction.objectStore('savedRecipes');
  const request = store.getAll();

  return new Promise<Recipe[]>((resolve, reject) => {
    request.onsuccess = () => {
      resolve(request.result as Recipe[]);
    };
    request.onerror = () => {
      reject(request.error);
    };
  });
};

// Fetch all saved recipes from IndexedDB
export const getSavedRecipesFromDB = async (): Promise<Recipe[]> => {
  const db = await openDBWithChat();
  const transaction = db.transaction('savedRecipes', 'readonly');
  const store = transaction.objectStore('savedRecipes');
  const request = store.getAll();

  return new Promise<Recipe[]>((resolve, reject) => {
    request.onsuccess = () => {
      resolve(request.result as Recipe[]);
    };
    request.onerror = () => {
      reject(request.error);
    };
  });
};

// Save a chat message to IndexedDB
export const saveChatMessageToDB = async (message: ChatMessage): Promise<void> => {
  const db = await openDBWithChat();
  const transaction = db.transaction(CHAT_STORE_NAME.name, 'readwrite');
  const store = transaction.objectStore(CHAT_STORE_NAME.name);

  console.log('[saveChatMessageToDB] Saving chat message to IndexedDB:', message);

  // Ensure the message includes a valid sessionId
  if (!message.sessionId || message.sessionId === 'current_session_id') {
    throw new Error('Chat message is missing a valid session ID');
  }

  store.put(message); // Save the message object to IndexedDB

  return new Promise<void>((resolve, reject) => {
    transaction.oncomplete = () => {
      console.log('[saveChatMessageToDB] Chat message saved successfully');
      resolve();
    };
    transaction.onerror = () => {
      console.error('[saveChatMessageToDB] Error saving chat message:', transaction.error);
      reject(transaction.error);
    };
  });
};

// Delete a chat session from IndexedDB
export const deleteChatSessionFromDB = async (sessionId: string): Promise<void> => {
  const db = await openDBWithChat();
  const transaction = db.transaction('savedSessions', 'readwrite');
  const store = transaction.objectStore('savedSessions');
  store.delete(sessionId);

  return new Promise<void>((resolve, reject) => {
    transaction.oncomplete = () => {
      resolve();
    };
    transaction.onerror = () => {
      reject(transaction.error);
    };
  });
};

// Delete a chat message from IndexedDB
export const deleteChatMessageFromDB = async (messageId: string): Promise<void> => {
  const db = await openDBWithChat();
  const transaction = db.transaction(CHAT_STORE_NAME.name, 'readwrite');
  const store = transaction.objectStore(CHAT_STORE_NAME.name);
  store.delete(messageId);

  return new Promise<void>((resolve, reject) => {
    transaction.oncomplete = () => {
      resolve();
    };
    transaction.onerror = () => {
      reject(transaction.error);
    };
  });
};

// Delete pending recipe from IndexedDB after successful sync
export const deletePendingRecipe = async (id: string): Promise<void> => {
  const db = await openDBWithChat();
  const transaction = db.transaction('savedRecipes', 'readwrite');
  const store = transaction.objectStore('savedRecipes');
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

// Delete a recipe from IndexedDB
export const deleteRecipeFromDB = async (id: string): Promise<void> => {
  const db = await openDBWithChat();
  const transaction = db.transaction('savedRecipes', 'readwrite');
  const store = transaction.objectStore('savedRecipes');
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

// Fetch the last user message for a specific session ID
export const getLastUserMessageFromDB = async (sessionId: string): Promise<string | null> => {
  const db = await openDBWithChat();
  const transaction = db.transaction('chatMessages', 'readonly');
  const store = transaction.objectStore('chatMessages');

  const messages: ChatMessage[] = await new Promise((resolve, reject) => {
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result as ChatMessage[]); // Safely cast here
    request.onerror = () => reject(request.error);
  });

  // Find the last user message within the session
  const lastMessage = messages
    .filter((msg: ChatMessage) => msg.sessionId === sessionId && msg.sender === 'user') // Explicit type
    .pop();

  return lastMessage ? lastMessage.text : null;
};

// Fetch the last user message object for a specific session ID
export const getLastUserMessageObjectFromDB = async (sessionId: string): Promise<ChatMessage | null> => {
  const db = await openDBWithChat();
  const transaction = db.transaction('chatMessages', 'readonly');
  const store = transaction.objectStore('chatMessages');

  const messages: ChatMessage[] = await new Promise((resolve, reject) => {
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result as ChatMessage[]); // Safely cast here
    request.onerror = () => reject(request.error);
  });

  // Find the last user message within the session
  return messages
    .filter((msg: ChatMessage) => msg.sessionId === sessionId && msg.sender === 'user') // Explicit type
    .pop() || null;
};
