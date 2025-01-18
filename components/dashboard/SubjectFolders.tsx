import React from 'react';
// import { Folder } from 'lucide-react';
import Folder from "@/public/folder.svg"
import Image from 'next/image';


const SubjectFolders = () => {
  const folders = [
    { label: 'NEW', color: 'gray-400' },
    { label: 'DS', color: 'yellow-100' },
    { label: 'DS', color: 'yellow-100' },
    { label: 'DS', color: 'yellow-100' },
    { label: 'DS', color: 'yellow-100' }
  ];

  return (
    <div className="p-6 rounded-lg w-[1095px] h-[274px]">
      <h2 className="text-lg font-semibold text-green-700 mb-4">Subjects</h2>
      <div className="flex gap-4 bg-[#F6F7F9] rounded-xl w-[1095px] h-[231px] items-center justify-center">
        {folders.map((folder, index) => (
          <div key={index} className="relative group flex flex-col items-center">
            {/* Folder content */}
            <div className="relative  rounded-lg  p-4 pt-8 flex flex-col items-center">
              <Image alt='folder'  src={Folder} />
              <div className={`mt-2 text-center text-sm font-medium  rounded px-2 py-0.5`}>
                {folder.label}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubjectFolders;
