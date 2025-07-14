"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { UserProvider } from "@/context/UserContext";
import AppSidebar from "../organisms/AppSidebar/AppSidebar";
import { useCallback, useState } from "react";
import { CollectionsProvider } from "../organisms/Collections/useCollections";
import { useCollectionDocument } from "@/hooks/useCollectionDocument";
import Header from "../molecules/Header/Header";

interface EditorLayoutClientProps {
  children: React.ReactNode;
  user: any;
  handleSignOut: (formData: FormData) => Promise<void>;
}

export default function EditorLayout({
  children,
  user,
  handleSignOut,
}: EditorLayoutClientProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { collectionsData, documentsData } = useCollectionDocument();

  const [isFocusMode, setIsFocusMode] = useState(false);
  const [commentsPanelOpen, setCommentsPanelOpen] = useState(true);

  const toggleFocusMode = useCallback(() => {
    const newFocusMode = !isFocusMode;
    setIsFocusMode(newFocusMode);

    if (newFocusMode) {
      setCommentsPanelOpen(false);
    } else {
      setCommentsPanelOpen(true);
    }
  }, [isFocusMode]);

  return (
    <UserProvider user={user}>
      <SidebarProvider
        defaultOpen={true}
        open={isSidebarOpen}
        onOpenChange={setIsSidebarOpen}
      >
        <CollectionsProvider>
          <AppSidebar
            collections={collectionsData ?? null}
            documents={documentsData ?? null}
            user={user}
            handleSignOut={handleSignOut}
            collapsible="offcanvas"
          />
          <div className="h-full flex flex-col w-full">
            <Header onFocusToggle={toggleFocusMode} />
            <div className="flex-1 flex flex-col justify-between overflow-y-hidden overflow-x-hidden">
              {children}
            </div>
          </div>
        </CollectionsProvider>
      </SidebarProvider>
    </UserProvider>
  );
}
