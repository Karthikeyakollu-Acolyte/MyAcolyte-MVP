"use client";

import React, { useEffect, useState } from "react";
import {
    Tree,
    Folder,
    File,
    CollapseButton,
} from "../ui/tree-view-api";


import type { PDFDocumentProxy } from "pdfjs-dist";

interface OutlineItem {
    action: any | null; // Additional action details if applicable
    dest: string | null; // Destination for navigation
    url: string | null; // External URL if present
    title: string; // Title of the outline entry
    color: {
        [key: string]: number; // RGB color as an object with keys 0, 1, 2
    };
    bold: boolean; // Indicates if the title is bold
    italic: boolean; // Indicates if the title is italic
    items: OutlineItem[]; // Nested children outline items
}

interface TransformedOutlineItem {
    id: string; // Unique identifier for Tree elements
    isSelectable: boolean; // Indicates if this item is selectable
    name: string; // Title of the outline entry
    children: TransformedOutlineItem[]; // Transformed nested items
    dest?: string | null; // Navigation destination
    url?: string | null; // External URL if present
}


interface PDFOutlineViewerProps {
    pdfDocument: PDFDocumentProxy; // Replace with the actual PDFDocumentProxy type from PDF.js
}

const PDFOutlineViewer: React.FC<PDFOutlineViewerProps> = ({
    pdfDocument,
}) => {
    const [outline, setOutline] = useState<TransformedOutlineItem[] | null>(null);

    // Fetch outline when the component mounts or pdfDocument changes
    useEffect(() => {
        if (!pdfDocument) return;
        pdfDocument.getMetadata().then(meta => console.log(meta));
        pdfDocument.getOutline().then((outlineData: OutlineItem[]) => {
            setOutline(transformOutline(outlineData));
            console.log(outlineData)
        });

    }, [pdfDocument]);

    // Transform the outline into a nested structure compatible with the Tree component
    const transformOutline = (outlineItems: OutlineItem[]): TransformedOutlineItem[] => {
        if (!outlineItems) return [];
        return outlineItems.map((item, index) => ({
            id: `item-${index}`,
            isSelectable: true,
            name: item.title || "Untitled",
            children: transformOutline(item.items || []),
            dest: item.dest,
            url: item.url,
        }));
    };


    // Handle click events for outline links
    const handleItemClick = (item: TransformedOutlineItem) => {
        console.log('Clicked item details:', item); // Log the whole object
        console.log('Title:', item.title); // Log specific property
        console.log('URL:', item.url); // Log specific property
        console.log('Destination:', item.dest); // Log specific property
        console.log('Bold:', item.bold); // Log specific property
        console.log('Italic:', item.italic); // Log specific property
        console.log('Items:', item.items); // Log nested items
        if (item.url) {
            window.open(item.url, "_blank"); // Open external URLs in a new tab
        } else if (item.dest) {
            //linkService.goToDestination(item.dest); // Navigate within the PDF using the destination
        }
    };


    // Recursive render function to generate the nested structure
    const renderTree = (elements: TransformedOutlineItem[]) => {
        return elements.map((item) => {
            if (item.children && item.children.length > 0) {
                return (
                    <Folder key={item.id} value={item.id} element={item.name}>
                        {renderTree(item.children)}
                    </Folder>
                );
            }
            return (
                <div key={item.id} onClick={() => handleItemClick(item)}>
                    <File value={item.id}>
                        <p>{item.name}</p>
                    </File>
                </div>
            );
        });
    };


    return (
        <Tree
            className="rounded-md h-screen bg-background overflow-hidden p-2"
            elements={outline || []}
        >
            {renderTree(outline || [])}
            <CollapseButton elements={outline || []} />
        </Tree>
    );
};

export default PDFOutlineViewer;
