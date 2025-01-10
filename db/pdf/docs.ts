import { openDB } from 'idb';
import { deleteLayers } from './layers';

const DB_NAME = 'pdfDatabase';
const DB_VERSION = 1;
const PDF_STORE_NAME = 'pdfStore';
const THUMBNAIL_STORE_NAME = 'thumbnailStore';

// Initialize IndexedDB
export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(PDF_STORE_NAME)) {
        db.createObjectStore(PDF_STORE_NAME, { keyPath: 'documentId' });
      }
      if (!db.objectStoreNames.contains(THUMBNAIL_STORE_NAME)) {
        db.createObjectStore(THUMBNAIL_STORE_NAME, { keyPath: 'documentId' });
      }
    },
  });
};

// Add a PDF document
export const addPdf = async (document: { documentId: string; base64: string }) => {
  const db = await initDB();
  return db.put(PDF_STORE_NAME, document);
};

// Add or update the document's thumbnail (optimized store)
export const addThumbnail = async (documentId: string, thumbnail: string) => {
  const db = await initDB();
  return db.put(THUMBNAIL_STORE_NAME, { documentId, thumbnail });
};

// Get all PDFs (includes both documentId and thumbnail)
export const getAllPdfs = async () => {
  const db = await initDB();
  const pdfs = await db.getAll(PDF_STORE_NAME);
  const thumbnails = await db.getAll(THUMBNAIL_STORE_NAME);

  // Map thumbnails to corresponding PDFs
  return pdfs.map(pdf => {
    const thumbnailDoc = thumbnails.find(thumbnail => thumbnail.documentId === pdf.documentId);
    return {
      ...pdf,
      thumbnail: thumbnailDoc ? thumbnailDoc.thumbnail : null,
    };
  });
};

// Delete a PDF by ID
export const deletePdf = async (documentId: string) => {
  const db = await initDB();
  await db.delete(PDF_STORE_NAME, documentId);
  await deleteLayers(documentId)
  return db.delete(THUMBNAIL_STORE_NAME, documentId); // Also delete from the thumbnail store
};



// Get a PDF by ID
export const getPdfById = async (documentId: string) => {
  const db = await initDB();
  const pdf = await db.get(PDF_STORE_NAME, documentId);
  const thumbnail = await db.get(THUMBNAIL_STORE_NAME, documentId);
  return {
    ...pdf,
    thumbnail: thumbnail ? thumbnail.thumbnail : null,
  };
};

// Update a PDF's thumbnail
export const updatePdf = async (documentId: string, thumbnail: string) => {
  const db = await initDB();

  // Fetch the existing document
  const existingDocument = await db.get(PDF_STORE_NAME, documentId);

  if (!existingDocument) {
    throw new Error(`Document with ID ${documentId} not found`);
  }

  // Update the document with the new thumbnail in the thumbnail store
  await addThumbnail(documentId, thumbnail);

  // Save the updated document back to the PDF store
  return db.put(PDF_STORE_NAME, existingDocument);
};
