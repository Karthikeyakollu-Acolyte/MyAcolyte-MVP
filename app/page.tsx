"use client"
import TodoNotes from '@/components/dashboard/Todo'
import FileSystem from '@/components/FileSystem'
import FolderTree  from '@/components/dashboard/FolderTree'
import { useState } from 'react'
import FolderTree1 from '@/components/dashboard/FolderTree-1'

export default function Home() {
   const [currentPath, setCurrentPath] = useState<string[]>([])
  return (
    <main className="min-h-screen bg-gray-100">
 <TodoNotes />
 {/* <FolderTree/> */}
 <FolderTree1/>
    </main>
  )
}

