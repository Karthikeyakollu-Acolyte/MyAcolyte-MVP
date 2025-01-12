"use client"
import FileSystem from '@/components/FileSystem'
import { useState } from 'react'

export default function Home() {
   const [currentPath, setCurrentPath] = useState<string[]>([])
  return (
    <main className="min-h-screen bg-gray-100">
<FileSystem
              currentPath={currentPath}
              setCurrentPath={setCurrentPath}
              fileType='note'
            />
    </main>
  )
}

