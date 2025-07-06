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
export interface ICollection {
  id: string;
  name: string;
  parent_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface IDocumentItem {
  id: string;
  collection_id: string;
  title: string;
  content?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
}

interface SidebarProps extends React.ComponentProps<typeof Sidebar> {
  collections: ICollection[] | null;
  documents: IDocumentItem[] | null;
  user?: any | null;
  handleSignOut: any;
  collapsible?: "icon" | "offcanvas" | "none";
}

export default function AppSidebar({
  collections = [],
  documents = [],
  user = [],
  handleSignOut,
  collapsible = "offcanvas",
  ...props
}: SidebarProps) {
  return (
    <Sidebar collapsible={collapsible} {...props}>
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
                    {user ? user.user_metadata?.full_name || "User" : "Guest"}
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

      <SidebarContent>
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
    </Sidebar>
  );
}
