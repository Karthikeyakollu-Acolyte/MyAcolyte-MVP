"use client";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { addPdf } from "@/db/pdf/docs";
import { useRouter } from "next/navigation";
import { FileUploadComponent } from "../ui/file-upload";
import FileSystem from "@/components/FileSystem";

const FileUpload = () => {
  const router = useRouter();
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState<File | null>(null);
  const [documentId, setDocumentId] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");

  // Handle file change and validation
  const handleFileChange = async (files: File[]) => {
    const file = files[0];
    if (file && file.type === "application/pdf") {
      setSelectedPdf(file);
      setDocumentId(uuidv4()); // Generate a unique ID for the file
      setFileName(file.name); // Store file name
      setIsOverlayOpen(true); // Show overlay for file saving
    } else {
      alert("Please select a valid PDF file.");
    }
  };

const handleSavePdf = async () => {
  if (!selectedPdf) return;

  const reader = new FileReader();

  reader.onload = async () => {
    const arrayBuffer = reader.result as ArrayBuffer;
    
    // Convert ArrayBuffer to Base64
    const base64String = arrayBufferToBase64(arrayBuffer);

    try {
      // Save the PDF content in IndexedDB
      await addPdf({ documentId, base64: base64String });

      alert(`PDF file saved to IndexedDB and added to the folder! Current Path: ${currentPath}`);
      setIsOverlayOpen(false); // Close overlay after saving
    } catch (error) {
      console.error("Error saving PDF:", error);
      alert("Failed to save the PDF. Please try again.");
    }
  };

  reader.onerror = () => {
    alert("Error reading the file. Please try again.");
  };

  reader.readAsArrayBuffer(selectedPdf);
};

// Helper function to convert ArrayBuffer to Base64
const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  // Convert ArrayBuffer to Uint8Array
  const uint8Array = new Uint8Array(buffer);
  
  // Convert Uint8Array to string using reduce
  const binaryString = uint8Array.reduce((str, byte) => str + String.fromCharCode(byte), '');
  
  // Convert binary string to base64
  return btoa(binaryString);
};
  // Handle cancel button to reset states
  const handleCancel = () => {
    setSelectedPdf(null);
    setIsOverlayOpen(false); // Close overlay if user cancels
  };

  return (
    <div>
      <FileUploadComponent onChange={handleFileChange} />

      {isOverlayOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              width: "80%",
              maxHeight: "80%",
              overflowY: "auto",
            }}
          >
            <FileSystem
              currentPath={currentPath}
              setCurrentPath={setCurrentPath}
              file={{ documentId, fileName }} // Pass the documentId and fileName
              fileType="pdf"
              saveFile={handleSavePdf}

            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
