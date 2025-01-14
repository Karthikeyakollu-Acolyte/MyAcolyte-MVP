'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronRight, Plus } from 'lucide-react';
import { getNoteById, getAllNotes } from '@/db/note/Note'; // Adjust based on your DB methods
import { getFileSystem, saveFileSystem } from '@/db/pdf/fileSystem';
interface Note {
  id: string;
  name: string;
  parentId: string | null;
  type: 'folder' | 'note';
}

export default function NotesTree() {
  const [notes, setNotes] = useState<Note[]>([
    { id: '1', name: 'Website Redesign', parentId: null, type: 'folder' },
    { id: '2', name: 'Design System', parentId: '1', type: 'note' },
    { id: '3', name: 'Wireframes', parentId: '1', type: 'note' },
    { id: '4', name: 'Drafts', parentId: null, type: 'folder' },
    { id: '5', name: 'Introduction', parentId: '4', type: 'note' }
  ]
  );
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  const fetchNotes = useCallback(async () => {
    try {
      const fetchedNotes = await getAllNotes(); // Fetch all notes and folders
      setNotes(fetchedNotes);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleToggleFolder = (folderId: string) => {
    setExpandedFolders((prev) =>
      prev.has(folderId) ? new Set([...prev].filter((id) => id !== folderId)) : new Set(prev).add(folderId)
    );
  };

  const renderTree = (parentId: string | null) => {
    const items = notes.filter((note) => note.parentId === parentId);
    return (
      <ul className="list-none pl-4">
        {items.map((item) => (
          <li key={item.id} className="mb-2">
            {item.type === 'folder' ? (
              <>
                <div
                  className="flex items-center cursor-pointer group"
                  onClick={() => handleToggleFolder(item.id)}
                >
                  <ChevronRight
                    className={`transition-transform ${expandedFolders.has(item.id) ? 'rotate-90' : ''} w-4 h-4 mr-2`}
                  />
                  <span className="group-hover:font-semibold">{item.name}</span>
                </div>
                {expandedFolders.has(item.id) && renderTree(item.id)}
              </>
            ) : (
              <div className="ml-6">{item.name}</div>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="w-64 bg-gray-50 p-4 shadow-md rounded">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Lessons</h2>
        <button className="text-gray-500 hover:text-gray-700 transition">
          <Plus className="w-5 h-5" />
        </button>
      </div>
      <div>{renderTree(null)}</div>
    </div>
  );
}
