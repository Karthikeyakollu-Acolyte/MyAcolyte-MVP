'use client'

import { useState, useEffect } from 'react';
import { SettingsProvider } from '@/context/SettingsContext'


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






