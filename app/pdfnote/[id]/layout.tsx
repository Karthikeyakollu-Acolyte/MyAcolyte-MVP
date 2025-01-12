'use client'

import { useState, useEffect } from 'react';
import Header from '@/components/canvas/Header';
import ScrollableContent from '@/components/ScrollableContent';
import { CanvasProvider } from '@/context/CanvasContext'
import { SettingsProvider } from '@/context/SettingsContext'
import { RefsProvider } from '@/context/sharedRefs'
import { ToolProvider } from '@/context/ToolContext'
import Toolbar from '@/components/toolbar/Toolbar';
import ToggleInfiniteCanvas from '@/components/canvas/ToggleInfiniteCanvas';
import PDFViewSelector from '@/components/pdfcomponents/pdf-view-selector';
import PDFCounter from '@/components/pdfcomponents/pdf-page-counter';
import page from './page';

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




            <RefsProvider>
                <ToolProvider>
                    <SettingsProvider>

                        <CanvasProvider>
                            < Header />
                            <PDFViewSelector/>
                            <PDFCounter/>

                            {children}
                            
                            <ToggleInfiniteCanvas />
                            <Toolbar/>


                        </CanvasProvider>

                    </SettingsProvider>
                </ToolProvider>
            </RefsProvider>

        </div>
    );
}






