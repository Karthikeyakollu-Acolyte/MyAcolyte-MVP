"use client";
import React, { useEffect, useState } from "react";
import { ChevronUp, ChevronDown, FileText, File } from "lucide-react";
import { Button } from "../ui/button";
import PdfFile from "@/public/pdf-file.svg";
import Image from "next/image";
import { getAllPdfs } from "@/db/pdf/docs";
import { useRouter } from "next/navigation";

const SubjectsFiles = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const router = useRouter();

  const fetchFilesFromIndexedDB = async () => {
    const pdfs = await getAllPdfs();
    setFiles(pdfs);
    console.log(pdfs)
  };

  useEffect(() => {
    fetchFilesFromIndexedDB();
  }, []);

  const dropdownOptions = ["Data Science", "Deep learning", "Natural language"];

  const openPdfViewer = (id) => {
    router.push(`/pdfnote/${id}`);
  };

  return (
    <div className="w-[529px] h-[431px] mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-medium text-green-800">Subject</h2>
        <div className="flex gap-3">
          <Button className="px-4 py-2 bg-[#38A169] text-white rounded-full text-sm font-medium hover:bg-green-600 transition-colors">
            New Upload
          </Button>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors"
            >
              <File className="h-4 w-4" />{" "}
              <span className="text-sm"> Big Data</span>
              {isDropdownOpen ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg">
                {dropdownOptions.map((option, index) => (
                  <button
                    key={index}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 bg-[#F6F7F9] p-6 rounded-lg w-[529px] h-[430px]">
        {files.map((file, index) => (
          <div key={index} className="cursor-pointer hover:scale-2" onClick={() => openPdfViewer(file.documentId
          )}>
            <Image src={PdfFile} alt="l" className="w-[102px] h-[128px]" />
            <div className="pb-4 pt-2">
              <p className="text-xs font-medium text-gray-900 truncate">
                {file.name}
              </p>
              <p className="text-xs text-gray-500">{file.uploadTime}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubjectsFiles;
