"use client"
import React, { useEffect, useState } from 'react';
import Link from 'next/link'; // Import Link for client-side navigation
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { deletePdf, getAllPdfs } from '@/db/pdf/docs'; // Assuming you have this function to get all PDFs with thumbnails
import { getUpdatedAt } from '@/db/pdf/layers';
import { Trash2 } from 'lucide-react'; // Import the Trash icon
import FileUpload from '@/components/dashboard/FileUpload';

function page() {
  const [pdfs, setPdfs] = useState<{ documentId: string; thumbnail: string | null }[]>([]);
  const [updatedAtMap, setUpdatedAtMap] = useState<{ [documentId: string]: string | null }>({});

  // Fetch the PDFs from IndexedDB
  useEffect(() => {
    const fetchPdfs = async () => {
      const savedPdfs = await getAllPdfs();
      setPdfs(savedPdfs);
      console.log(savedPdfs.length)
    };

    fetchPdfs();
  }, []);

  // Fetch the updatedAt for each document
  useEffect(() => {
    const fetchUpdatedAt = async () => {
      const newUpdatedAtMap: { [documentId: string]: string | null } = {};

      for (const pdf of pdfs) {
        try {
          const updatedAtValue = await getUpdatedAt(pdf.documentId); // Fetch updatedAt for each document
          newUpdatedAtMap[pdf.documentId] = updatedAtValue;
        } catch (error) {
          console.error('Error fetching updatedAt:', error);
          newUpdatedAtMap[pdf.documentId] = null;
        }
      }

      setUpdatedAtMap(newUpdatedAtMap); // Store all updatedAt values in state
    };

    if (pdfs.length > 0) {
      fetchUpdatedAt(); // Only fetch updatedAt when pdfs are available
    }
  }, [pdfs]); // Fetch updatedAt every time pdfs change

  // Function to handle PDF deletion
  const removePdf = async (documentId: string) => {
    try {
      await deletePdf(documentId); // Assuming this function deletes the PDF from the IndexedDB or any other storage
      setPdfs(pdfs.filter(pdf => pdf.documentId !== documentId)); // Remove the deleted PDF from the state
      setUpdatedAtMap(prev => {
        const updated = { ...prev };
        delete updated[documentId]; // Remove the deleted PDF's updatedAt from the state
        return updated;
      });
    } catch (error) {
      console.error('Error deleting PDF:', error);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-rubik font-semibold text-[#6105A2] mb-4">All PdfNotes</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {pdfs.map((pdf, i) => (

          <div key={i} className="flex group flex-col items-start relative">
            {/* Wrap the Card with the Link component to navigate to the note */}

            <Link href={`/pdfnote/${pdf.documentId}`} passHref>
              <Card className="relative p-4 w-[182px] h-[224px] border-[#EFF0F6] border-2 cursor-pointer group transform transition duration-250 hover:scale-105">
                {/* Overlay with blur effect */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 group-hover:backdrop-blur-[0.5px] transition-all duration-250"></div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    removePdf(pdf.documentId);
                  }}
                  className="absolute right-2 top-2 group-hover:flex hidden text-red-500 transition duration-250"
                >
                  <Trash2 size={20} className='fill-red-300' />
                </button>

                <div className="h-full flex justify-center items-center">
                  {/* Render the thumbnail image if available */}
                  {pdf.thumbnail ? (
                    <img
                      src={pdf.thumbnail}
                      alt={`Thumbnail for PDF ${pdf.documentId}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-gray-400">No Thumbnail</div>
                  )}
                </div>
              </Card>

            </Link>
            <div className="mt-2">
              <CardTitle>Note {i + 1}</CardTitle>
              {/* Render the updatedAt value for the current document */}
              <CardDescription>
                Edited: {updatedAtMap[pdf.documentId] || 'N/A'}
              </CardDescription>
            </div>
          </div>
        ))}
        <FileUpload />
      </div>
    </div>
  );
}

export default page;