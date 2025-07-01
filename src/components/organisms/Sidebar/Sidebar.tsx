"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { FolderOpen } from "lucide-react";
import React from "react";
import Collections from "../Collections/Collections";

export interface Collection {
  id: string;
  name: string;
  parent_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface DocumentItem {
  id: string;
  collection_id: string;
  title: string;
  content?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
}

interface SidebarProps extends React.ComponentProps<typeof Sidebar> {
  collections: Collection[] | null;
  documents: DocumentItem[] | null;
  user?: any | null;
  handleSignOut: any;
}

export default function AppSidebar({
  collections = [],
  documents = [],
  user = [],
  handleSignOut,
}: SidebarProps) {
  return (
    <div className="h-full flex flex-col bg-sidebar border-r">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <FolderOpen className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">
                    {user
                      ? user.user_metadata?.full_name ||
                        "User"
                      : "Guest"}
                  </span>
                  <span className="text-xs">
                    {user ? user.email : "Collections"}
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="flex-1 overflow-auto">
        {collections?.length === 0 && documents?.length === 0 ? (
          <div className="text-sm text-muted-foreground p-2">
            No collections found
          </div>
        ) : (
          <Collections collections={collections} documents={documents} />
        )}

        <SidebarGroup>
          <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="#" className="flex items-center gap-2">
                    {/* <Settings className="size-4" /> */}
                    <span>Settings</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {user && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <button
                      type="submit"
                      className="flex items-center gap-2 text-red-600 hover:text-red-700 w-full text-left"
                      onClick={handleSignOut}
                    >
                      <span>Sign Out</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </div>
  );
}
