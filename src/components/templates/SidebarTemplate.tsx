"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { UserProvider } from "@/context/UserContext";
import AppSidebar from "../organisms/AppSidebar/AppSidebar";
import { useState } from "react";

interface EditorLayoutClientProps {
  children: React.ReactNode;
  user: any;
  collectionsData: any[];
  documentsData: any[];
  handleSignOut: (formData: FormData) => Promise<void>;
}

export default function EditorTemplate({
  children,
  user,
  collectionsData,
  documentsData,
  handleSignOut,
}: EditorLayoutClientProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <UserProvider user={user}>
      <SidebarProvider
        defaultOpen={true}
        open={isSidebarOpen}
        onOpenChange={setIsSidebarOpen}
      >
        <AppSidebar
          collections={collectionsData}
          documents={documentsData}
          user={user}
          handleSignOut={handleSignOut}
          collapsible="offcanvas"
        />
        {children}
      </SidebarProvider>
    </UserProvider>
  );
}
