"use client";
import React, { useState } from "react";
import TrackerDashboard from "@/components/dashboard/Tracker";
import StudyDashboard from "@/components/dashboard/StudyDashboard";
import TodoList from "@/components/dashboard/Todo";
import SubjectFolders from "@/components/dashboard/SubjectFolders";

import FileSystem from "@/components/dashboard/FileSystem";

export default function Dashboard() {
  return (
    <div className="flex flex-col h-full">
      <div className="mb-24">
        <TrackerDashboard />
      </div>

      <div className="mb-24">
        <SubjectFolders />
      </div>

      <div className="mb-36">
      <StudyDashboard />
      </div>
    </div>
  );
}
