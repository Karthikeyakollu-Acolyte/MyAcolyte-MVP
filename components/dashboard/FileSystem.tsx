"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Folder, File, ChevronRight, Check, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getFileSystem, saveFileSystem } from "@/db/pdf/fileSystem";
import { getPdfById } from "@/db/pdf/docs";
import { getNoteById } from "@/db/note/Note";
import Subjects from "@/public/folder.svg";
import Image from "next/image";
import PlainNote from "@/public/noteplain.svg";
import PdfFile from "@/public/pdf-file.svg";

interface FileSystemItem {
  id: string;
  name: string;
  type: "file" | "folder";
  fileType?: "pdf" | "note";
  parentId: string | null;
}

interface FileSystemProps {
  currentPath: string;
  setCurrentPath: (path: string) => void;
  file?: {
    documentId: string;
    fileName: string;
  };
  fileType?: "pdf" | "note" | "root";
  saveFile?: () => void;
}

export default function FileSystem({
  currentPath,
  setCurrentPath,
  file,
  fileType = "root",
  saveFile,
}: FileSystemProps) {
  const [fileSystem, setFileSystem] = useState<FileSystemItem[]>([]);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);

  // Fetch file system data
  const fetchFileSystem = useCallback(async () => {
    try {
      let storedFileSystem = await getFileSystem();
      if (!storedFileSystem || storedFileSystem.length === 0) {
        storedFileSystem = [];
      }
      setFileSystem(storedFileSystem);
    } catch (error) {
      console.error("Error fetching file system:", error);
    }
  }, []);

  useEffect(() => {
    fetchFileSystem();
  }, [fetchFileSystem]);

  const updateFileSystem = useCallback(
    async (updatedFileSystem: FileSystemItem[]) => {
      try {
        setFileSystem(updatedFileSystem);
        await saveFileSystem(updatedFileSystem);
      } catch (error) {
        console.error("Error updating file system:", error);
      }
    },
    []
  );

  const getCurrentItems = useCallback(() => {
    // If we're in root, show only folders
    if (!currentFolder) {
      return fileSystem.filter((item) => item.parentId === null);
    }

    // If we're in a folder, show files of the correct type and no folders
    return fileSystem.filter(
      (item) =>
        item.parentId === currentFolder &&
        (item.type === "file"
          ? fileType === "root" || item.fileType === fileType
          : true)
    );
  }, [fileSystem, currentFolder, fileType]);

  const handleItemClick = useCallback(
    async (item: FileSystemItem) => {
      if (item.type === "folder") {
        setCurrentFolder(item.id);
        setCurrentPath([item.name]);
      } else if (item.type === "file") {
        try {
          if (item.fileType === "pdf") {
            const doc = await getPdfById(item.id);
            if (doc) {
              console.log("PDF Document content:", doc.base64);
              alert(`Opened PDF file: ${item.name}`);
            }
          } else if (item.fileType === "note") {
            const note = await getNoteById(item.id);
            if (note) {
              console.log("Note content:", note);
              alert(`Opened Note file: ${item.name}`);
            }
          }
        } catch (error) {
          console.error("Error fetching file:", error);
          alert("Failed to open the file.");
        }
      }
    },
    [setCurrentPath]
  );

  const handleBackClick = useCallback(() => {
    setCurrentFolder(null);
    setCurrentPath([]);
  }, [setCurrentPath]);

  const handleRename = useCallback(
    async (id: string, newName: string) => {
      if (newName.trim() === "") {
        setEditingItem(null);
        return;
      }

      const updatedFileSystem = fileSystem.map((item) => {
        if (item.id === id) {
          if (item.type === "file") {
            const extension = item.fileType === "pdf" ? ".pdf" : ".notes";
            return {
              ...item,
              name: newName.endsWith(extension)
                ? newName.trim()
                : `${newName.trim()}${extension}`,
            };
          }
          return { ...item, name: newName.trim() };
        }
        return item;
      });

      await updateFileSystem(updatedFileSystem);
      setEditingItem(null);
    },
    [fileSystem, updateFileSystem]
  );

  const handleCreateFolder = useCallback(async () => {
    if (currentFolder) return; // Prevent folder creation inside folders

    const newFolder: FileSystemItem = {
      id: Date.now().toString(),
      name: "New Folder",
      type: "folder",
      parentId: null,
    };

    const updatedFileSystem = [...fileSystem, newFolder];
    await updateFileSystem(updatedFileSystem);
    setEditingItem(newFolder.id);
  }, [fileSystem, updateFileSystem, currentFolder]);

  const handleAddFileToCurrentFolder = useCallback(async () => {
    if (!file?.documentId || !currentFolder) return;

    const extension = fileType === "pdf" ? ".pdf" : ".notes";
    const fileName = file.fileName.endsWith(extension)
      ? file.fileName
      : `${file.fileName}${extension}`;

    const newFile: FileSystemItem = {
      id: file.documentId,
      name: fileName,
      type: "file",
      fileType: fileType === "pdf" ? "pdf" : "note",
      parentId: currentFolder,
    };

    const updatedFileSystem = [...fileSystem, newFile];
    await updateFileSystem(updatedFileSystem);
    if (saveFile) {
      saveFile();
    }
  }, [file, currentFolder, fileType, fileSystem, updateFileSystem, saveFile]);

  const getFileIcon = (item: FileSystemItem) => {
    if (item.type === "folder") {
      return <Image src={Subjects} alt="folder" />;
    }

    if (item.type === "file") {
      console.log(item);
      if (item.fileType === "note") {
        return <Image src={PlainNote} alt="plainNote" />;
      } else if (item.fileType === "pdf") {
        return <Image src={PdfFile} alt="pdfFile" />;
      }
    }

    // Default case (if no matching type is found)
    return null;
  };

  return (
    <div className="flex flex-col  w-full h-full">
      <div className=" p-2 flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBackClick}
            disabled={!currentFolder}
          >
            <ChevronRight className="rotate-180" />
          </Button>
          <div className="ml-2">
            {currentPath.length > 0 ? currentPath[0] : "Subjects"}
          </div>
        </div>
        <div className="flex items-center">
          {/* {!currentFolder && (
            <Button variant="ghost" size="icon" onClick={handleCreateFolder}>
              <Folder className="h-4 w-4" />
            </Button>
          )} */}
          {currentFolder && file && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleAddFileToCurrentFolder}
            >
              <Check className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 p-4 overflow-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 ">
          {!currentFolder && (
            <div
              className="flex flex-col items-center cursor-pointer  justify-center relative"
              onClick={handleCreateFolder}
            >
              <Image src={Subjects} alt="s" />

              <div className="mt-1 text-sm text-center absolute group top-1/2">
                <span>New</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute -right-6 top-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {}}
                ></Button>
              </div>
            </div>
          )}

          {getCurrentItems().map((item) => (
            <div
              key={item.id}
              className="flex flex-col items-center cursor-pointer relative  justify-center"
              onClick={() => handleItemClick(item)}
            >
              {getFileIcon(item)}
              {editingItem === item.id ? (
                <Input
                  type="text"
                  defaultValue={item.name.replace(/\.(pdf|notes)$/, "")}
                  onBlur={(e) => handleRename(item.id, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleRename(item.id, e.currentTarget.value);
                    }
                  }}
                  autoFocus
                  className=" text-sm text-center  editing-input absolute top-1/2"
                  data-id={item.id}
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <div
                  className={`text-sm text-center group ${
                    !item.fileType ? "absolute" : ""
                  } top-1/2 mt-1`}
                >
                  <div className="w-28">
                    <p className="truncate overflow-hidden whitespace-nowrap text-ellipsis">
                      {item.name}
                    </p>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute  -right-6 top-0 opacity-0 group-hover:opacity-100 transition-opacity"
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
