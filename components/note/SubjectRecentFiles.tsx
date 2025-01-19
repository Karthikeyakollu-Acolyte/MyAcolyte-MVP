"use client";
import React, { useEffect, useState } from "react";
// import { Folder } from 'lucide-react';
import File from "@/public/noteplain.svg";
import Filecreate from "@/public/notecreate.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { getAllNotes, syncNote } from "@/db/note/Note";
import FileSystem from '@/components/dashboard/FileSystem';

const SubjectFolders = () => {
  const router = useRouter();
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState("");
  const [documentId, setDocumentId] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [file, setfile] = useState()
  const [files, setFiles] = useState([]);

  const openNotes = (id) => {
    router.push(`/note/${id}`);
  };




  const createNote = async () => {
        console.log("creating moted")

        const documentId = uuidv4(); // Generate a unique document ID
        setDocumentId(documentId)
        setIsOverlayOpen(false)

        try {
            // Add the PDF to IndexedDB
            await syncNote(documentId, { name: fileName });
            // router.push(`/note/${documentId}`); // Use next/navigation to navigate
        } catch (error) {
            console.error('Error saving PDF:', error);
            alert('Failed to save the PDF. Please try again.');
        }
    };



  const fetchFilesFromIndexedDB = async () => {
    const notes = await getAllNotes();
    setFiles(notes);
  };

  useEffect(() => {
    fetchFilesFromIndexedDB();
  }, []);

  const createNotes = () => {
    const id = uuidv4()
    setIsOverlayOpen(true)
    setFileName(id)
    setDocumentId(id)
    // router.push(`/note/${uuidv4()}`);
  };

  return (
    <div className="p-6 rounded-lg w-[1095px] h-[274px]">
      <h2 className="text-lg font-semibold text-green-700 mb-4">My Notes</h2>
      <div className="flex gap-4 bg-[#F6F7F9] rounded-xl w-[1095px] h-[231px] items-center justify-start">
        <div
          className="relative group flex flex-col items-center  cursor-pointer"
          onClick={createNotes}
        >
          {/* Folder content */}
          <div className="relative  rounded-lg  p-4 pt-8 flex flex-col items-center">
            <Image alt="folder" src={Filecreate} />
            <div
              className={`mt-2 text-center text-sm font-medium  rounded px-2 py-0.5`}
            >
              Create New
            </div>
          </div>
        </div>
        {files.map((folder, index) => (
          <div
            key={index}
            className="relative group flex flex-col items-center cursor-pointer"
            onClick={() => openNotes(folder.documentId)}
          >
            {/* Folder content */}
            <div className="relative  rounded-lg  p-4 pt-8 flex flex-col items-center">
              <Image alt="folder" src={File} />
              <div
                className={`mt-2 text-center text-sm font-medium  rounded px-2 py-0.5`}
              >
                {folder?.name}
              </div>
            </div>
          </div>
        ))}
      </div>

      {isOverlayOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              width: "80%",
              maxHeight: "80%",
              overflowY: "auto",
            }}
          >
            <FileSystem
              currentPath={currentPath}
              setCurrentPath={setCurrentPath}
              file={{ documentId, fileName }} // Pass the documentId and fileName
              fileType="note"
              saveFile={createNote}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectFolders;
