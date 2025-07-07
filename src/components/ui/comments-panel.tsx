"use client";

import * as React from "react";
import {
  MessageSquare,
  Plus,
  MoreHorizontal,
  Reply,
  Heart,
  AlertCircle,
  CheckCircle2,
  Search,
  Pin,
  Archive,
  Trash2,
  Edit3,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sidebar, SidebarProvider, SidebarTrigger } from "./sidebar";
import TipTap from "@/components/molecules/TipTap/TipTap";

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

export function CommentsPanel() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  return (
    <SidebarProvider
      defaultOpen={true}
      open={isSidebarOpen}
      onOpenChange={setIsSidebarOpen}
      className="w-fit"
    >
      <SidebarTrigger />
      <Sidebar collapsible="offcanvas" side="right">
        <h2>Outline</h2>
        <div className="min-h-8">
          <TipTap />
        </div>
        <h2>Resources</h2>
        <div className="bg-gray-200 rounded-md m-3">
          <div>Dog - Wikipedia</div>
          <p>This is need to be a main inspiration</p>
          <div className="flex gap-2">
            <a
              href="https://en.wikipedia.org/wiki/Dog"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              dogs
            </a>
            <a
              href="https://en.wikipedia.org/wiki/Dog"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              zoology
            </a>
          </div> 
        </div>

        <div className="bg-gray-200 rounded-md m-3">
          <div>Dog - Wikipedia</div>
          <p>This is need to be a main inspiration</p>
          <div className="flex gap-2">
            <a
              href="https://en.wikipedia.org/wiki/Dog"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              dogs
            </a>
            <a
              href="https://en.wikipedia.org/wiki/Dog"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              zoology
            </a>
          </div> 
        </div>

        <div className="bg-gray-200 rounded-md m-3">
          <div>Dog - Wikipedia</div>
          <p>This is need to be a main inspiration</p>
          <div className="flex gap-2">
            <a
              href="https://en.wikipedia.org/wiki/Dog"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              dogs
            </a>
            <a
              href="https://en.wikipedia.org/wiki/Dog"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              zoology
            </a>
          </div> 
        </div>
      </Sidebar>
    </SidebarProvider>
  );
}
