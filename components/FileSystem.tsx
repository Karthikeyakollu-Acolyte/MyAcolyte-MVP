'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Folder, File, ChevronRight, Check, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getFileSystem, saveFileSystem } from '@/db/pdf/fileSystem';
import { getPdfById } from "@/db/pdf/docs";
import { getNoteById } from "@/db/note/Note";

interface FileSystemItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  fileType?: 'pdf' | 'note'; // Added fileType for files
  children?: FileSystemItem[];
}

interface FileSystemProps {
  currentPath: string[];
  setCurrentPath: (path: string[]) => void;
  file?: {
    documentId: string;
    fileName: string;
  };
  fileType?: 'pdf' | 'note' | 'root';
  saveFile?: () => void;
}

const getInitialFileSystem = (): FileSystemItem[] => {
  return [
    {
      id: 'root',
      name: 'root',
      type: 'folder',
      children: []
    }
  ];
};

export default function FileSystem({ currentPath, setCurrentPath, file, fileType = 'root', saveFile }: FileSystemProps) {
  const [fileSystem, setFileSystem] = useState<FileSystemItem[]>([]);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Fetch file system data
  const fetchFileSystem = useCallback(async () => {
    try {
      let storedFileSystem = await getFileSystem();
      
      if (!storedFileSystem || storedFileSystem.length === 0) {
        storedFileSystem = getInitialFileSystem();
        await saveFileSystem(storedFileSystem);
      }
      
      setFileSystem(storedFileSystem);
      setIsInitialized(true);
    } catch (error) {
      console.error('Error fetching file system:', error);
    }
  }, []);

  useEffect(() => {
    fetchFileSystem();
  }, [fetchFileSystem]);

  const updateFileSystem = useCallback(async (updatedFileSystem: FileSystemItem[]) => {
    try {
      setFileSystem(updatedFileSystem);
      await saveFileSystem(updatedFileSystem);
    } catch (error) {
      console.error('Error updating file system:', error);
    }
  }, []);

  const getCurrentFolder = useCallback(() => {
    let current = { children: fileSystem };
    
    for (const pathPart of currentPath) {
      const found = current.children?.find((item) => item.name === pathPart);
      if (!found) return [];
      current = found;
    }

    const items = current.children || [];
    
    // Filter items based on fileType if not root
    if (fileType !== 'root') {
      return items.filter(item => 
        item.type === 'folder' || 
        (item.type === 'file' && item.fileType === fileType)
      );
    }
    
    return items;
  }, [fileSystem, currentPath, fileType]);

  const handleItemClick = useCallback(async (item: FileSystemItem) => {
    if (item.type === 'folder') {
      setCurrentPath([...currentPath, item.name]);
    } else if (item.type === 'file') {
      try {
        if (item.fileType === 'pdf') {
          const doc = await getPdfById(item.id);
          if (doc) {
            console.log('PDF Document content:', doc.base64);
            alert(`Opened PDF file: ${item.name}`);
          }
        } else if (item.fileType === 'note') {
          const note = await getNoteById(item.id);
          if (note) {
            console.log('Note content:', note);
            alert(`Opened Note file: ${item.name}`);
          }
        }
      } catch (error) {
        console.error('Error fetching file:', error);
        alert('Failed to open the file.');
      }
    }
  }, [currentPath, setCurrentPath]);

  const handleBackClick = useCallback(() => {
    if (currentPath.length > 0) {
      setCurrentPath(currentPath.slice(0, -1));
    }
  }, [currentPath, setCurrentPath]);

  const handleRename = useCallback(async (id: string, newName: string) => {
    if (newName.trim() === '') {
      setEditingItem(null);
      return;
    }

    const updatedFileSystem = [...fileSystem];
    let found = false;

    const findAndRename = (items: FileSystemItem[]) => {
      for (let i = 0; i < items.length; i++) {
        if (items[i].id === id) {
          // Preserve file extension if it's a file
          if (items[i].type === 'file') {
            const extension = items[i].fileType === 'pdf' ? '.pdf' : '.notes';
            if (!newName.endsWith(extension)) {
              items[i].name = `${newName.trim()}${extension}`;
            } else {
              items[i].name = newName.trim();
            }
          } else {
            items[i].name = newName.trim();
          }
          found = true;
          break;
        }
        if (items[i].children) {
          findAndRename(items[i].children);
          if (found) break;
        }
      }
    };

    findAndRename(updatedFileSystem);
    
    if (found) {
      await updateFileSystem(updatedFileSystem);
    }
    setEditingItem(null);
  }, [fileSystem, updateFileSystem]);

  const handleCreateFolder = useCallback(async () => {
    const newFolder: FileSystemItem = {
      id: Date.now().toString(),
      name: 'New Folder',
      type: 'folder',
      children: [],
    };

    const updatedFileSystem = [...fileSystem];
    let current = { children: updatedFileSystem };
    
    for (const pathPart of currentPath) {
      const found = current.children?.find((item) => item.name === pathPart);
      if (!found) return;
      current = found;
    }

    if (current.children) {
      current.children.push(newFolder);
      await updateFileSystem(updatedFileSystem);
      setEditingItem(newFolder.id);
    }
  }, [currentPath, fileSystem, updateFileSystem]);

  const handleAddFileToCurrentFolder = useCallback(async () => {
    if (!file?.documentId) return;

    const updatedFileSystem = [...fileSystem];
    let current = { children: updatedFileSystem };

    for (const pathPart of currentPath) {
      const found = current.children?.find((item) => item.name === pathPart);
      if (!found) return;
      current = found;
    }

    if (current.children) {
      const extension = fileType === 'pdf' ? '.pdf' : '.notes';
      const fileName = file.fileName.endsWith(extension) 
        ? file.fileName 
        : `${file.fileName}${extension}`;

      const newFile: FileSystemItem = {
        id: file.documentId,
        name: fileName,
        type: 'file',
        fileType: fileType === 'pdf' ? 'pdf' : 'note'
      };

      current.children.push(newFile);
      await updateFileSystem(updatedFileSystem);
      if (saveFile) {
        saveFile();
        
      }
    }
    
  }, [file, currentPath, fileType, fileSystem, updateFileSystem, saveFile]);

  const getFileIcon = (item: FileSystemItem) => {
    if (item.type === 'folder') {
      return <Folder className="w-16 h-16 text-blue-500" />;
    }
    return <File className={`w-16 h-16 ${item.fileType === 'pdf' ? 'text-red-500' : 'text-green-500'}`} />;
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="bg-gray-200 p-2 flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleBackClick} 
            disabled={currentPath.length === 0}
          >
            <ChevronRight className="rotate-180" />
          </Button>
          <div className="ml-2">{currentPath.length > 0 ? currentPath.join(' / ') : 'Root'}</div>
        </div>
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={handleCreateFolder}>
            <Folder className="h-4 w-4" />
          </Button>
          {file && (
            <Button variant="ghost" size="icon" onClick={handleAddFileToCurrentFolder}>
              <Check className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      <div className="flex-1 p-4 overflow-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {getCurrentFolder().map((item) => (
            <div
              key={item.id}
              className="flex flex-col items-center cursor-pointer"
              onClick={() => handleItemClick(item)}
            >
              {getFileIcon(item)}
              {editingItem === item.id ? (
                <Input
                  type="text"
                  defaultValue={item.name.replace(/\.(pdf|notes)$/, '')}
                  onBlur={(e) => handleRename(item.id, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleRename(item.id, e.currentTarget.value);
                    }
                  }}
                  autoFocus
                  className="mt-2 text-sm text-center w-full editing-input"
                  data-id={item.id}
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <div className="mt-2 text-sm text-center relative group">
                  <span>{item.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute -right-6 top-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingItem(item.id);
                    }}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}