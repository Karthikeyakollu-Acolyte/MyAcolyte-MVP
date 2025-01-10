"use client";
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { addPdf } from '@/db/pdf/docs';
import { useRouter } from 'next/navigation'; // Using next/navigation's useRouter
import { FileUploadComponent } from '../ui/file-upload';

const FileUpload = () => {
  const router = useRouter(); // Initialize the useRouter hook from next/navigation

  const handleFileChange = async (files: File[]) => {
    const file = files[0];
    if (file && file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        const documentId = uuidv4(); // Generate a unique document ID

        try {
          // Add the PDF to IndexedDB
          await addPdf({ documentId, base64 });
          alert('PDF file saved to IndexedDB!');

          // Navigate to the new note page after successful upload
          router.push(`/pdfnote/${documentId}`); // Use next/navigation to navigate
        } catch (error) {
          console.error('Error saving PDF:', error);
          alert('Failed to save the PDF. Please try again.');
        }
      };
      reader.onerror = () => {
        alert('Error reading the file. Please try again.');
      };
      reader.readAsDataURL(file); // Read the file as a Base64 encoded string
    } else {
      alert('Please select a valid PDF file.');
    }
  };


  return (
    <div>
      <FileUploadComponent onChange={handleFileChange} />
    </div>
  );
};

export default FileUpload;
