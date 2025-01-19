import React, { useState, useEffect } from "react";
import {
  ChevronRight,
  ChevronDown,
  Plus,
  File,
  MoreVertical,
  Upload,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { getFileSystem } from "@/db/pdf/fileSystem"; // Assuming this fetches the folder data
import { FileUploadWrapper } from "./file-upload";

import FileNote from "@/public/noteplain.svg";
import PdfFile from "@/public/pdf-file.svg";
import Image from "next/image";

const FolderTree = () => {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
    const [fileType, setFileType] = useState<"note"| "pdf">()

  // Fetch folder data dynamically
  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const data = await getFileSystem(); // Fetch the folder structure
        const formattedData = formatFolderStructure(data);
        setFolders(formattedData);
        console.log(formattedData);
      } catch (error) {
        console.error("Error fetching folders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFolders();
  }, []);

  // Helper function to format folder structure
  const formatFolderStructure = (data) => {
    const folderMap = {};
    const rootFolders = [];

    // Create a map of all folders and notes
    data.forEach((item) => {
      folderMap[item.id] = {
        ...item,
        isOpen: false,
        isActive: false,
        files: [],
      };
    });

    // Organize folders and notes by parentId
    data.forEach((item) => {
      if (item.parentId) {
        folderMap[item.parentId].files.push(folderMap[item.id]);
      } else {
        rootFolders.push(folderMap[item.id]);
      }
    });

    return rootFolders;
  };

  const toggleFolder = (e, folderId) => {
    e.stopPropagation(); // Prevent event from bubbling
    setFolders(
      folders.map((folder) =>
        folder.id === folderId ? { ...folder, isOpen: !folder.isOpen } : folder
      )
    );
  };

  const selectFolder = (folderId) => {
    setFolders(
      folders.map((folder) => ({
        ...folder,
        isActive: folder.id === folderId,
      }))
    );
  };

  const handleCreatePdf = () => {
    console.log("Create PDF clicked");
  };

  const handleUploadNotes = () => {
    console.log("Upload Notes clicked");
  };

  const handleFolderClick = (e, folder) => {
    selectFolder(folder.id);
  };

  const handleChevronClick = (e, folderId) => {
    toggleFolder(e, folderId);
  };

  const handleMoreClick = (e) => {
    e.stopPropagation(); // Prevent folder selection when clicking more options
  };

  if (loading) {
    return (
      <div className="w-72 bg-white h-screen border-r p-4">Loading...</div>
    );
  }

  return (
    <>
      {" "}
      {isOpen && (
        <FileUploadWrapper isUploadPdf={isOpen} setIsOpen={setIsOpen} fileType={fileType} />
      )}
      <div className="flex items-center justify-between px-3">
        <span className="text-xs font-semibold font-rubik text-gray-500">
          SUBJECTS
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 hover:bg-gray-100"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                setIsOpen(true);
                setFileType('pdf')
              }}
            >
              <File className="mr-2 h-4 w-4" />
              Create PDF
            </DropdownMenuItem>
            <DropdownMenuItem  onClick={() => {
                setIsOpen(true);
                setFileType('note')
              }}>
              <Upload className="mr-2 h-4 w-4" />
              Upload Notes
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="w-full bg-white">
        <div className="p-3">
          {folders.map((folder) => (
            <div key={folder.id}>
              <div
                className={`mb-1 rounded-lg ${
                  folder.isActive ? "bg-[#F4F1FF]" : "hover:bg-gray-50"
                }`}
              >
                <div
                  className="flex items-center justify-between p-3 cursor-pointer"
                  onClick={(e) => handleFolderClick(e, folder)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        folder.isActive ? "bg-purple-600" : "bg-orange-400"
                      }`}
                    />
                    <span
                      className={`text-base ${
                        folder.isActive
                          ? "text-purple-600 font-semibold"
                          : "text-gray-500"
                      }`}
                    >
                      {folder.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {folder.files.length > 0 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 hover:bg-white/50"
                        onClick={(e) => handleChevronClick(e, folder.id)}
                      >
                        {folder.isOpen ? (
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 hover:bg-white/50"
                      onClick={handleMoreClick}
                    >
                      <MoreVertical className="h-4 w-4 text-gray-400" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Files tree view */}
              <div
                className={`ml-7 pl-4 border-l border-gray-200 overflow-hidden transition-all duration-200 ease-in-out ${
                  folder.isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                {folder.files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer ml-2"
                  >
                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                    <Image
                      className={`w-4 h-4`}
                      src={file.fileType === "pdf" ? PdfFile : FileNote}
                      alt="s"
                    />
                    <span className="text-sm text-gray-600">{file.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default FolderTree;
