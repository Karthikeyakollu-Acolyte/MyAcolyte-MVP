import { openDB } from 'idb';

const DB_NAME = 'CanvasDB';
const STORE_NAME = 'Documents';
const VERSION = 1;

async function initDB() {
  return openDB(DB_NAME, VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('id', 'id', { unique: true });
      }
    },
  });
}

export async function saveAppState(currentDocumentId, elements, appState, pageIndex) {
  const db = await initDB();

  // Retrieve existing document or create a new one
  const existingDoc = (await db.get(STORE_NAME, currentDocumentId)) || { id: currentDocumentId, canvases: {} };

  // Update or add the app state and elements for the specific pageIndex
  existingDoc.canvases[pageIndex] = {
    elements: elements,  // Save elements
    appState: appState,  // Save appState
  };

  // Save the updated document back to the store
  await db.put(STORE_NAME, existingDoc);
}


export async function getCanvasByPageIndex(currentDocumentId, pageIndex) {
  const db = await initDB();
  const document = await db.get(STORE_NAME, currentDocumentId);
  if (document && document.canvases[pageIndex]) {
    return document.canvases[pageIndex]; // Return both elements and appState
  }
  return null; // Return null if no data exists for the pageIndex
}
