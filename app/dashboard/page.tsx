"use client"
import { Metrics } from "@/components/dashboard/metrics"
import { StudyMaterials } from "@/components/dashboard/study-materials"
import React, { useState } from "react"
import FileSystem from '@/components/FileSystem';


export default function Dashboard() {
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  return (
    <div className="flex flex-col bg-[#FFFFFF] w-full h-screen">
      <Metrics />
      <StudyMaterials />
      <FileSystem
                 currentPath={currentPath}
                 setCurrentPath={setCurrentPath}
                 fileType="root"
   
               />
    </div>
  )
}
