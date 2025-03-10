// "use client"
// import React, { useEffect, useState } from 'react';
// import Link from 'next/link'; // Import Link for client-side navigation
// import { Card, CardTitle, CardDescription } from '@/components/ui/card';
// import { getUpdatedAt, syncNote, getAllNotes, deleteNotes } from '@/db/note/Note';
// import { Trash2, SquarePlus } from 'lucide-react'; // Import the Trash icon
// import { v4 as uuidv4 } from 'uuid';
// import { useRouter } from 'next/navigation';
// import FileSystem from '@/components/FileSystem';

// function page() {
//     const [notes, setNotes] = useState<{ documentId: string; thumbnail: string | null }[]>([]);
//     const [updatedAtMap, setUpdatedAtMap] = useState<{ [documentId: string]: string | null }>({});
//     const router = useRouter();
//       const [isOverlayOpen, setIsOverlayOpen] = useState(false);
//     const [currentPath, setCurrentPath] = useState<string[]>([]);
//       const [documentId, setDocumentId] = useState<string>("");
//       const [fileName, setFileName] = useState<string>("New Note");
//     // Fetch the PDFs from IndexedDB
//     useEffect(() => {
//         const fetchNotes = async () => {
//             const savedPdfs = await getAllNotes();
//             setNotes(savedPdfs);
//             console.log(savedPdfs.length)
//         };

//         fetchNotes();
//     }, []);

//     // Fetch the updatedAt for each document
//     useEffect(() => {
//         const fetchUpdatedAt = async () => {
//             const newUpdatedAtMap: { [documentId: string]: string | null } = {};

//             for (const pdf of notes) {
//                 try {
//                     const updatedAtValue = await getUpdatedAt(pdf.documentId); // Fetch updatedAt for each document
//                     newUpdatedAtMap[pdf.documentId] = updatedAtValue;
//                 } catch (error) {
//                     console.error('Error fetching updatedAt:', error);
//                     newUpdatedAtMap[pdf.documentId] = null;
//                 }
//             }

//             setUpdatedAtMap(newUpdatedAtMap); // Store all updatedAt values in state
//         };

//         if (notes.length > 0) {
//             fetchUpdatedAt(); // Only fetch updatedAt when pdfs are available
//         }
//     }, [notes]); // Fetch updatedAt every time pdfs change

//     const createNote = async () => {
//         console.log("creating moted")

//         const documentId = uuidv4(); // Generate a unique document ID
//         setDocumentId(documentId)
//         setIsOverlayOpen(false)

//         try {
//             // Add the PDF to IndexedDB
//             await syncNote(documentId, { name: fileName });
//             // router.push(`/note/${documentId}`); // Use next/navigation to navigate
//         } catch (error) {
//             console.error('Error saving PDF:', error);
//             alert('Failed to save the PDF. Please try again.');
//         }
//     };

//     // Function to handle PDF deletion
//     const removeNote = async (documentId: string) => {
//         try {
//             await deleteNotes(documentId); // Assuming this function deletes the PDF from the IndexedDB or any other storage
//             setNotes(notes.filter(note => note.documentId !== documentId)); // Remove the deleted PDF from the state
//             setUpdatedAtMap(prev => {
//                 const updated = { ...prev };
//                 delete updated[documentId]; // Remove the deleted PDF's updatedAt from the state
//                 return updated;
//             });
//         } catch (error) {
//             console.error('Error deleting PDF:', error);
//         }
//     };

//     return (
//         <div className="mt-8">
//             <h2 className="text-2xl font-rubik font-semibold text-[#6105A2] mb-4">All Notes</h2>

//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//                 {notes.map((note, i) => (

//                     <div key={i} className="flex group flex-col items-start relative">
//                         {/* Wrap the Card with the Link component to navigate to the note */}

//                         <Link href={`/note/${note.documentId}`} passHref>
//                             <Card className="relative p-4 w-[182px] h-[224px] border-[#EFF0F6] border-2 cursor-pointer group transform transition duration-250 hover:scale-105">
//                                 {/* Overlay with blur effect */}
//                                 <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 group-hover:backdrop-blur-[0.5px] transition-all duration-250"></div>

//                                 <button
//                                     onClick={(e) => {
//                                         e.stopPropagation();
//                                         e.preventDefault();
//                                         removeNote(note.documentId);
//                                     }}
//                                     className="absolute right-2 top-2 group-hover:flex hidden text-red-500 transition duration-250"
//                                 >
//                                     <Trash2 size={20} className='fill-red-300' />
//                                 </button>

//                                 <div className="h-full flex justify-center items-center">
//                                     {/* Render the thumbnail image if available */}
//                                     {note.thumbnail ? (
//                                         <img
//                                             src={note.thumbnail}
//                                             alt={`Thumbnail for PDF ${note.documentId}`}
//                                             className="w-full h-full object-cover"
//                                         />
//                                     ) : (
//                                         <div className="text-center text-gray-400">No Thumbnail</div>
//                                     )}
//                                 </div>
//                             </Card>

//                         </Link>
//                         <div className="mt-2">
//                             <CardTitle>Note {i + 1}</CardTitle>
//                             {/* Render the updatedAt value for the current document */}
//                             <CardDescription>
//                                 Edited: {updatedAtMap[note.documentId] || 'N/A'}
//                             </CardDescription>
//                         </div>
//                     </div>
//                 ))}
//                 <div className='w-[182px] h-[224px] bg-white shadow-lg rounded-lg flex justify-center items-center transform transition duration-250 hover:scale-105 cursor-pointer'
//                     onClick={() => { setIsOverlayOpen(true) }}

//                 >
//                     <SquarePlus size={80} className='text-slate-200' />
//                 </div>
//             </div>

//                         <div className='h-[30vh] border-2 mt-20'>
//                         <FileSystem
//                              currentPath={currentPath}
//                              setCurrentPath={setCurrentPath}
//                              fileType="note"

//                            />
//                         </div>

//                         {isOverlayOpen && (
//         <div
//           style={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             width: "100%",
//             height: "100%",
//             backgroundColor: "rgba(0, 0, 0, 0.7)",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             zIndex: 1000,
//           }}
//         >
//           <div
//             style={{
//               backgroundColor: "white",
//               borderRadius: "8px",
//               width: "80%",
//               maxHeight: "80%",
//               overflowY: "auto",
//             }}
//           >
//             <FileSystem
//               currentPath={currentPath}
//               setCurrentPath={setCurrentPath}
//               file={{ documentId:"123", fileName:"fnmae" }} // Pass the documentId and fileName
//               fileType="note"
//               saveFile={createNote}

//             />
//           </div>
//         </div>
//       )}
//         </div>
//     );
// }

// export default page;

"use client";
import FlashCards from "@/components/dashboard/FlashCards";
import SubjectFolders from "@/components/note/SubjectRecentFiles";
import SubjectsFiles from "@/components/note/SubjectFiles";
import React from "react";

const page = () => {
  return (
    <div className="mt-32 font-rubik">
      <SubjectFolders />
      <div className="flex  gap-8 mt-20 mb-20  ">
        <FlashCards />
        <SubjectsFiles fileType="note" />
      </div>
    </div>
  );
};

export default page;
