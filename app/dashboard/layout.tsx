"use client"
import React from 'react'
import { DashHeader } from "@/components/dashboard/DashHeader"
import { SidebarNav } from "@/components/dashboard/sidebar-nav"
import { TasksSidebar } from "@/components/dashboard/tasks-sidebar"
import ScrollableContent from '@/components/ScrollableContent';
import Toolbar from '@/components/toolbar/Toolbar';
import { CanvasProvider } from '@/context/CanvasContext'
import { SettingsProvider, useSettings } from '@/context/SettingsContext'
import { RefsProvider } from '@/context/sharedRefs'
import { ToolProvider } from '@/context/ToolContext'
import TodoNotes from '@/components/dashboard/Todo'
import TodoList from '@/components/dashboard/Todo'

type Props = {}

const Layout = ({ children }:any) => {
    return (
        <div>
            <RefsProvider>
                <ToolProvider>
                    <SettingsProvider>

                        <CanvasProvider>
                            <div className="flex flex-col bg-[#FFFFFF] w-full h-screen overflow-hidden">
                                <div>
                                    <DashHeader />
                                </div>

                                <div className="flex">
                                    <SidebarNav />
                                    <main className="flex-1 p-10 pl-16">
                                        <div className="max-w-6xl">
                                            {children}

                                        </div>
                                    </main>
                                    {/* <TodoNotes /> */}
                                    <TodoList /> 
                                </div>
                            </div>

                           
                        </CanvasProvider>

                    </SettingsProvider>
                </ToolProvider>
            </RefsProvider>

        </div>
    )
}

export default Layout