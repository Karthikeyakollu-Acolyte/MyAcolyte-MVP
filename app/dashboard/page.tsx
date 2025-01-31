"use client";
import React, { useState } from "react";
import TrackerDashboard from "@/components/dashboard/Tracker";
import StudyDashboard from "@/components/dashboard/StudyDashboard";
import SubjectFolders from "@/components/dashboard/SubjectFolders";
export default function Dashboard() {
  return (
    <div className="flex flex-col h-full overflow-auto scrollbar-hide font-rubik">
      <div className="mb-24">
        <TrackerDashboard />
      </div>

      <div className="mb-24">
        <SubjectFolders />
      </div>

      <div className="mb-20">
      <StudyDashboard />
      </div>
    </div>
  );
}
