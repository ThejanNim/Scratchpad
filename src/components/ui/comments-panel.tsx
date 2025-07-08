"use client";

import * as React from "react";
import { Sidebar, SidebarProvider, SidebarTrigger } from "./sidebar";
import TipTap from "@/components/molecules/TipTap/TipTap";
import ResourceItem from "../molecules/ResourceItem/ResourceItem";

interface Comment {
  id: string;
  author: {
    name: string;
    avatar: string;
    initials: string;
    role: string;
    color: string;
  };
  content: string;
  timestamp: string;
  status: "open" | "resolved" | "archived";
  selectedText: string;
  position: { start: number; end: number };
  likes: number;
  isLiked: boolean;
  isPinned: boolean;
  replies: Array<{
    id: string;
    author: {
      name: string;
      avatar: string;
      initials: string;
      role: string;
      color: string;
    };
    content: string;
    timestamp: string;
    likes: number;
    isLiked: boolean;
  }>;
}

interface CommentsPanelProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  documentsData: {
    id: string;
    content: string;
    title: string;
    outline: string;
  };
}

export function CommentsPanel({ 
  documentsData,
  isOpen = true, 
  onOpenChange 
}: CommentsPanelProps) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  React.useEffect(() => {
    setIsSidebarOpen(isOpen);
  }, [isOpen]);

  const handleOpenChange = (open: boolean) => {
    setIsSidebarOpen(open);
    onOpenChange?.(open);
  };

  return (
    <SidebarProvider
      defaultOpen={true}
      open={isSidebarOpen}
      onOpenChange={handleOpenChange}
      className="w-fit"
      style={
        {
          "--sidebar-width": "28rem",
        } as React.CSSProperties
      }
    >
      <SidebarTrigger />
      <Sidebar collapsible="offcanvas" side="right" className="p-4">
        <h2>Outline</h2>
        <div className="min-h-8">
          <TipTap documentsData={documentsData} />
        </div>
        <h2>Resources</h2>
        <div className="flex gap-2 mt-4">
          <ResourceItem />

          <ResourceItem />
        </div>

        <div className="flex gap-2 mt-4">
          <ResourceItem />

          <ResourceItem />
        </div>

        <div className="flex gap-2 mt-4">
          <ResourceItem />
        </div>
      </Sidebar>
    </SidebarProvider>
  );
}
