"use client"
import React, { useState } from "react";
// import { Folder } from 'lucide-react';
import Folder from "@/public/folder.svg";
import Image from "next/image";
import FileSystem from "./FileSystem";

const SubjectFolders = () => {
  const folders = [
    { label: "New", section: "Introduction" },
    { label: "Data Science", section: "Core Concepts" },
    { label: "Data Science", section: "Machine Learning" },
    { label: "Data Science", section: "Statistics" },
    { label: "Data Science", section: "Deep Learning" },
];


  const [currentPath, setCurrentPath] = useState('')

  return (
    <div className="rounded-lg w-[1095px] h-[274px]">
      <h2 className="text-2xl font-semibold text-green-700 mb-4">Subjects</h2>
      <div className="flex gap-4 bg-[#F6F7F9] rounded-xl w-[1095px] h-[231px] flex-col items-center justify-center overflow-auto">
        {/* {folders.map((folder, index) => (
          <div
            key={index}
            className="relative group flex flex-col items-center"
          >

            <div className="relative  rounded-lg  p-4 pt-8 flex flex-col items-center">
              <Image alt="folder" src={Folder} />
              <div
                className={`mt-2 text-center text-sm font-medium  rounded px-2 py-0.5`}
              >
                {folder.label}
              </div>
            </div>
          </div>
        ))} */}


        <FileSystem currentPath={currentPath} setCurrentPath={setCurrentPath} fileType="root"  />


      </div>
    </div>
  );
};

export default SubjectFolders;
