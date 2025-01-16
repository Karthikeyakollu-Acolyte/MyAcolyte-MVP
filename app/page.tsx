"use client"
import TodoNotes from '@/components/dashboard/Todo'
import FileSystem from '@/components/FileSystem'
import FolderTree  from '@/components/dashboard/FolderTree'
import { useState } from 'react'
import FolderTree1 from '@/components/dashboard/FolderTree-1'
import ExcalidrawFabric from '@/components/canvas/excalidraw/ExcalidrawFabric'

export default function Home() {
   const [currentPath, setCurrentPath] = useState<string[]>([])
  return (
    <main className="min-h-screen bg-black">

    </main>
  )
}

