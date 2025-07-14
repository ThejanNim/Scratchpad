"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { CircleDot } from "lucide-react";
import {
  IconHelp,
  IconSearch,
  IconSettings,
} from "@tabler/icons-react";
import React from "react";
import Collections from "../Collections/Collections";
import { NavSecondary } from "./NavSecondary/NavSecondary";
import { AppSidebarFooter } from "./AppSidebarFooter/AppSidebarFooter";

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

const navSecondary = [
  {
    title: "Settings",
    url: "#",
    icon: IconSettings,
  },
  {
    title: "Get Help",
    url: "#",
    icon: IconHelp,
  },
  {
    title: "Search",
    url: "#",
    icon: IconSearch,
  },
];

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
            <SidebarMenuButton asChild>
              <a href="#">
                <CircleDot className="!size-5" />
                <span className="text-base font-semibold">Scratchpad</span>
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
          <Collections />
        )}

        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <AppSidebarFooter user={user} />
    </Sidebar>
  );
}
