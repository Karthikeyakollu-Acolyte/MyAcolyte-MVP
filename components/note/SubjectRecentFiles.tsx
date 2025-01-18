"use client";
import React, { useEffect, useState } from "react";
// import { Folder } from 'lucide-react';
import File from "@/public/noteplain.svg";
import Filecreate from "@/public/notecreate.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { getAllNotes } from "@/db/note/Note";

const SubjectFolders = () => {
  const router = useRouter();

  const openNotes = (id) => {

    router.push(`/note/${id}`);
  };

  const [files, setFiles] = useState([]);

  const fetchFilesFromIndexedDB = async () => {
    const notes = await getAllNotes();
    setFiles(notes);

  };

  useEffect(() => {
    fetchFilesFromIndexedDB();
  }, []);

  const createNotes = () => {
    router.push(`/note/${uuidv4()}`);
  };

  return (
    <div className="p-6 rounded-lg w-[1095px] h-[274px]">
      <h2 className="text-lg font-semibold text-green-700 mb-4">Subjects</h2>
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
                {folder?.name||`Note ${index+1}` }
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubjectFolders;
