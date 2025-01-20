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

const Layout: React.FC = ({ children }) => {
    return (
      <div className="app-container overflow-hidden h-screen">
        <RefsProvider>
          <ToolProvider>
            <SettingsProvider>
              <CanvasProvider>
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
              </CanvasProvider>
            </SettingsProvider>
          </ToolProvider>
        </RefsProvider>
      </div>
    );
  };

export default Layout