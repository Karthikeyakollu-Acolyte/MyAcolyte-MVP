
import { Metrics } from "@/components/dashboard/metrics"
import { StudyMaterials } from "@/components/dashboard/study-materials"
import React from "react"


export default function Dashboard() {
  return (
    <div className="flex flex-col bg-[#FFFFFF] w-full h-screen">
      <Metrics />
      <StudyMaterials />
    </div>
  )
}
