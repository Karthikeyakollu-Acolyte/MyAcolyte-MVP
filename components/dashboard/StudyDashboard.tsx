import React from "react";
import { FileText } from 'lucide-react';

const StudyDashboard = () => {
  return (
    <div className="flex gap-8">
      {/* Collaborative Study Section */}
      <div className="w-[529px] h-[476px]">
        <h2 className="text-2xl font-semibold text-emerald-700 mb-6">
          Collaborative study
        </h2>
        <DocumentList />
      </div>

     <ContinueReading/>
    </div>
  );
};

const ProgressBar = ({ color, progress }) => (
  <div className="w-48 h-2 bg-gray-100 rounded-full">
    <div 
      className={`h-full rounded-full ${color}`}
      style={{ width: `${progress}%` }}
    />
  </div>
);



export const ContinueReading = ()=>{

  return(<> 
  {/* Continue Reading Section */}
    <div className="w-[529px] h-[476px]">
      <h2 className="text-2xl font-semibold text-emerald-700 mb-6">
        Continue reading
      </h2>
      <ProgressList />
    </div></>)
}

const ProgressList = () => {
  const units = [
    { id: 5, progress: 25, color: 'bg-orange-400' },
    { id: 1, progress: 60, color: 'bg-red-400' },
    { id: 2, progress: 45, color: 'bg-blue-400' },
    { id: 6, progress: 15, color: 'bg-purple-500' },
  ];

  return (
    <div className="bg-gray-50 rounded-2xl w-[529px] h-[419px]">
      <div className="p-6">
        <div className="space-y-6 py-7">
          {units.map((unit, index) => (
            <div key={unit.id}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-indigo-900 font-semibold">
                    Unit {unit.id}-
                  </span>
                  <span className="text-gray-500">
                    Medical Apparatus
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <ProgressBar 
                    color={unit.color} 
                    progress={unit.progress}
                  />
                  <span className="text-gray-700 font-medium w-12">
                    {unit.progress}%
                  </span>
                </div>
              </div>
              
              {index !== units.length - 1 && (
                <div className="h-px bg-gray-200 mt-6" />
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-8 flex justify-end">
          <button className="text-indigo-600 font-medium flex items-center gap-2 hover:text-indigo-700 transition-colors">
            View All
            <svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

const PlusIcon = ({ className }) => (
  <svg 
    className={className} 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
    />
  </svg>
);

const DocumentRow = ({ number, more }) => {
  const getCircleColor = (num) => {
    const colors = {
      1: 'bg-green-100 text-green-600',
      3: 'bg-green-100 text-green-600',
      4: 'bg-green-100 text-green-600'
    };
    return colors[num] || 'bg-green-100 text-green-600';
  };

  return (
    <div className="py-6 pr-2 pl-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <FileText className="w-5 h-5 text-indigo-600" />
        <div>
          <div className="flex items-center gap-2">
            <span className="text-indigo-600 font-medium text-xl">Guyton and hall</span>
            <span className="text-gray-500 text-sm">- physiology</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors">
          <PlusIcon className="w-4 h-4 text-gray-500" />
        </button>
        
        <div className="flex items-center">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-5 h-5 rounded-full border-2 border-white bg-gray-200"
              />
            ))}
          </div>
          <span className="ml-2 text-gray-500 text-sm">+2 more</span>
        </div>

        <div className={`w-6 h-6 rounded-full ${getCircleColor(number)} flex items-center justify-center text-sm font-medium ml-2`}>
          {number}
        </div>
      </div>
    </div>
  );
};

export const DocumentList = () => {
  const documents = [
    { number: 1, more: 2 },
    { number: 3, more: 2 },
    { number: 4, more: 2 },
    { number: 1, more: 2 }
  ];

  return (
    <div className="bg-gray-50 rounded-2xl w-[529px] h-[419px] ">
      <div className="p-6">
        <div className="divide-y divide-gray-200">
          {documents.map((doc, index) => (
            <DocumentRow key={index} {...doc} />
          ))}
        </div>
        
        <div className="mt-8 flex justify-end">
          <button className="text-indigo-600 font-medium flex items-center gap-2 hover:text-indigo-700 transition-colors">
            View All
            <svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudyDashboard;