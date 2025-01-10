"use client"
import React, {useState } from 'react'
import { Button } from '../ui/button';
import { Lock, Unlock, Expand, Minimize } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

const ToggleInfiniteCanvas = () => {
   const {setIsInfinite,isInfinite} = useSettings()
    const toggleInfiniteCanvas = () => {
        setIsInfinite((prev:boolean) => !prev);
    };
    return (
        <div>
            <div className='flex gap-2 flex-col fixed bottom-16 right-8' style={{ zIndex: 10 }}>
                {/* Infinite Canvas Button */}
                <Button
                    onClick={toggleInfiniteCanvas}
                    variant={"ghost"}
                    className="rounded-lg shadow-lg bg-slate-200 hover:bg-blue-100"
                >

                    {isInfinite ? <Minimize size={24} /> : <Expand size={24} />}
                </Button>

            </div>
        </div>
    )
}

export default ToggleInfiniteCanvas
