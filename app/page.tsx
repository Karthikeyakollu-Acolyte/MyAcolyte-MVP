"use client";
import TodoNotes from "@/components/dashboard/Todo";
import FileSystem from "@/components/dashboard/FileSystem";
import FolderTree from "@/components/dashboard/FolderTree";
import { useState } from "react";
import FolderTree1 from "@/components/dashboard/FolderTree-1";
import ExcalidrawFabric from "@/components/canvas/excalidraw/ExcalidrawFabric";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TrackerDashboard from "@/components/dashboard/Tracker";
import StudyDashboard from "@/components/dashboard/StudyDashboard";
import FileUpload from "@/components/dashboard/file-upload";
import SubjectsFiles from "@/components/dashboard/Subjects";
import TodoList from "@/components/dashboard/Todo";
import ProfileSettings from "@/components/dashboard/ProfileSettings";
import FlashCards from "@/components/dashboard/FlashCards";
import FloatingHeader from "@/components/dashboard/Header";

export default function Home() {
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  return (
    <main className="h-[150vh] bg-white">
      {/* <TrackerDashboard /> */}
      {/* <StudyDashboard /> */}
      {/* <FileUpload /> */}
      {/* <SubjectsFiles /> */}
      {/* <TodoList /> */}
      {/* <ProfileSettings /> */}
      {/* <FlashCards /> */}
    </main>
  );
}
