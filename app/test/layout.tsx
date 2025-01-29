'use client'

import { useState, useEffect } from 'react';
import Header from '@/components/canvas/Header';
import ScrollableContent from '@/components/PdfViewerComponent';
import { SettingsProvider } from '@/context/SettingsContext'

import PDFViewSelector from '@/components/pdfcomponents/pdf-view-selector';
import PDFCounter from '@/components/pdfcomponents/pdf-page-counter';
import page from './page';
import Sidebar from './sidebar';

export default function Layout({ children }: any) {
    const [isExpanded, setIsExpanded] = useState(true);
   
    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };


    useEffect(() => {
        document.body.style.overflow = 'hidden';
    }, []);


    return (

        <div className="max-h-screen w-[100vw] overflow-hidden max-w-[1920px]">




                    <SettingsProvider>

                            {children}
                            
                           
                            {/* <Toolbar/> */}
                           
                    </SettingsProvider>

        </div>
    );
}






