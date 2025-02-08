"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    // Redirect to /dashboard on page load
    router.push('/dashboard');
  }, [router]);
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
