"use client"
import React from 'react'
import { DashHeader } from "@/components/dashboard/DashHeader"
import { SidebarNav } from "@/components/dashboard/sidebar-nav"
import { TasksSidebar } from "@/components/dashboard/tasks-sidebar"
import ScrollableContent from '@/components/PdfViewerComponent';
import { SettingsProvider, useSettings } from '@/context/SettingsContext'
import TodoNotes from '@/components/dashboard/Todo'
import TodoList from '@/components/dashboard/Todo'

type Props = {}

const Layout: React.FC = ({ children }) => {
    return (
      <div className="app-container overflow-hidden h-screen">


            <SettingsProvider>

                <div className="app-content">
                  <DashHeader />
                  <div className="flex min-h-0">
                    <SidebarNav />
                    <main className="flex-1 overflow-auto h-screen scrollbar-hidden p-10">
                      {children}
                    </main>
                    <TodoList />
                  </div>
                </div>
            </SettingsProvider>
      </div>
    );
  };

export default Layout