import React from 'react';
import SideNav from './Sidenav';
import { SidebarProvider, SidebarTrigger } from '../ui/sidebar';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen  font-sans">
      <SidebarProvider >
      <SideNav /> 
      <main className="flex-1 bg-background overflow-y-auto p-4">
        {children}
      </main>
      </SidebarProvider>
    </div>
  );
}