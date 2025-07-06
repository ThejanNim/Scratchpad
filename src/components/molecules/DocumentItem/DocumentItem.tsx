import {
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, File, Edit, Copy, Trash2 } from "lucide-react";
import { IDocumentItem } from "@/components/organisms/AppSidebar/Sidebar";
import Link from 'next/link'

export interface DocumentItemProps {
  document: IDocumentItem;
  level?: number;
  isLoading: boolean;
  handleDocumentAction: (
    documentId: string,
    action: "rename" | "duplicate" | "delete"
  ) => void;
}

export default function DocumentItem({
  document,
  level = 0,
  isLoading,
  handleDocumentAction,
}: DocumentItemProps) {
  return (
    <SidebarMenuSubItem>
      <div className="flex items-center group/item w-full">
        <SidebarMenuSubButton
          asChild
          className="flex-1"
          style={{ paddingLeft: `${level * 1}rem` }}
        >
          <Link href={`/editor/${document.id}`}>
            <File className="size-3" />
            <span>{document.title}</span>
          </Link>
        </SidebarMenuSubButton>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-5 w-5 p-0 opacity-0 group-hover/item:opacity-100 transition-opacity"
              onClick={(e) => e.stopPropagation()}
              disabled={isLoading}
            >
              <MoreHorizontal className="h-3 w-3" />
              <span className="sr-only">Document options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="right">
            <DropdownMenuItem
              onClick={() => handleDocumentAction(document.id, "rename")}
              disabled={isLoading}
            >
              <Edit className="h-4 w-4 mr-2" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDocumentAction(document.id, "duplicate")}
              disabled={isLoading}
            >
              <Copy className="h-4 w-4 mr-2" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDocumentAction(document.id, "delete")}
              className="text-red-600 focus:text-red-600"
              disabled={isLoading}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </SidebarMenuSubItem>
  );
}
