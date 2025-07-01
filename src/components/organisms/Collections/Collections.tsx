"use client";

import React from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronRight,
  Copy,
  Edit,
  File,
  Folder,
  MoreHorizontal,
  Plus,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Collection, DocumentItem } from "@/components/organisms/Sidebar/Sidebar";

export default function Collections({
  collections: initialCollections,
  documents: initialDocuments,
}: {
  collections: Collection[] | null;
  documents: DocumentItem[] | null;
}) {
  // Add state management for collections and documents
  const [collections, setCollections] = React.useState<Collection[] | null>(
    initialCollections
  );
  const [documents, setDocuments] = React.useState<DocumentItem[] | null>(initialDocuments);
  const [openSections, setOpenSections] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();

  // Update state when props change (when parent re-renders)
  React.useEffect(() => {
    setCollections(initialCollections);
  }, [initialCollections]);

  React.useEffect(() => {
    setDocuments(initialDocuments);
  }, [initialDocuments]);

  const buildTree = (
    parentId: string | null = null
  ): (Collection | DocumentItem)[] => {
    const items: (Collection | DocumentItem)[] = [];

    // Add child collections
    const childCollections = collections?.filter(
      (c) => c.parent_id === parentId
    );

    if (childCollections) {
        items.push(...childCollections);
    }

    // Add documents for this collection
    if (parentId) {
      const collectionDocuments = documents?.filter(
        (d) => d.collection_id === parentId
      );
      if (collectionDocuments) {
        items.push(...collectionDocuments);
      }
    }

    return items;
  };

  const toggleSection = (collectionId: string) => {
    setOpenSections((prev) =>
      prev.includes(collectionId)
        ? prev.filter((id) => id !== collectionId)
        : [...prev, collectionId]
    );
  };

  const createNewCollection = async (parentId?: string) => {
    const collectionName = prompt("Enter collection name:");
    if (!collectionName?.trim()) return;

    setIsLoading(true);
    try {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("collection")
        .insert({
          name: collectionName.trim(),
          parent_id: parentId || null,
        })
        .select()
        .single();

      if (error) throw error;

      // Update local state immediately
      setCollections((prev) => [...(prev ?? []), data]);

      // Optionally refresh the page for full sync
      router.refresh();
    } catch (error) {
      console.error("Error creating collection:", error);
      alert("Failed to create collection");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCollectionAction = async (
    collectionId: string,
    action: "delete" | "rename" | "duplicate"
  ) => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const supabase = createClient();

      switch (action) {
        case "delete":
          if (!confirm("Are you sure you want to delete this collection?"))
            return;

          const { error: deleteError } = await supabase
            .from("collection")
            .delete()
            .eq("id", collectionId);

          if (deleteError) throw deleteError;

          // Update local state
          setCollections((prev) => prev?.filter((c) => c.id !== collectionId) ?? []);
          break;

        case "rename":
          const newName = prompt("Enter new name:");
          if (!newName?.trim()) return;

          const { data, error: updateError } = await supabase
            .from("collection")
            .update({ name: newName.trim() })
            .eq("id", collectionId)
            .select()
            .single();

          if (updateError) throw updateError;

          // Update local state
          setCollections((prev) =>
            prev?.map((c) =>
              c.id === collectionId ? { ...c, name: data.name } : c
            ) ?? []
          );
          break;

        case "duplicate":
          const collection = collections?.find((c) => c.id === collectionId);
          if (!collection) return;

          const { data: duplicateData, error: duplicateError } = await supabase
            .from("collection")
            .insert({
              name: `${collection.name} (Copy)`,
              parent_id: collection.parent_id,
            })
            .select()
            .single();

          if (duplicateError) throw duplicateError;

          // Update local state
          setCollections((prev) => [...(prev ?? []), duplicateData]);
          break;
      }

      // Refresh for full sync
      router.refresh();
    } catch (error) {
      console.error(`Error ${action} collection:`, error);
      alert(`Failed to ${action} collection`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDocumentAction = async (
    documentId: string,
    action: "delete" | "rename" | "duplicate"
  ) => {
    // Similar implementation for documents
    console.log("Document action:", action, documentId);
  };

  const renderCollectionTree = (
    parentId: string | null = null,
    level: number = 0
  ): React.ReactNode => {
    const items = buildTree(parentId);

    return items.map((item) => {
      const isCollection = "parent_id" in item && !("collection_id" in item);
      const isOpen = openSections.includes(item.id);

      if (isCollection) {
        const collection = item as Collection;
        const hasChildren =
          collections?.some((c) => c.parent_id === collection.id) ||
          (documents?.some((d) => d.collection_id === collection.id) ?? false);

        return (
          <Collapsible
            key={collection.id}
            open={isOpen}
            onOpenChange={() => toggleSection(collection.id)}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <div className="flex items-center group/collection-item">
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    className="flex-1"
                    style={{ paddingLeft: `${level * 1}rem` }}
                  >
                    {hasChildren && (
                      <ChevronRight className="transition-transform group-data-[state=open]/collapsible:rotate-90 size-4" />
                    )}
                    <Folder className="size-4" />
                    <span>{collection.name}</span>
                  </SidebarMenuButton>
                </CollapsibleTrigger>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 opacity-0 group-hover/collection-item:opacity-100 transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                      disabled={isLoading}
                    >
                      <MoreHorizontal className="h-3 w-3" />
                      <span className="sr-only">Collection options</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" side="right">
                    <DropdownMenuItem
                      onClick={() => createNewCollection(collection.id)}
                      disabled={isLoading}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      New Subcollection
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        handleCollectionAction(collection.id, "rename")
                      }
                      disabled={isLoading}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        handleCollectionAction(collection.id, "duplicate")
                      }
                      disabled={isLoading}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        handleCollectionAction(collection.id, "delete")
                      }
                      className="text-red-600 focus:text-red-600"
                      disabled={isLoading}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <CollapsibleContent>
                <SidebarMenuSub>
                  {renderCollectionTree(collection.id, level + 1)}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        );
      } else {
        // Render document
        const document = item as DocumentItem;

        return (
          <SidebarMenuSubItem key={document.id}>
            <div className="flex items-center group/item w-full">
              <SidebarMenuSubButton
                asChild
                className="flex-1"
                style={{ paddingLeft: `${level * 1}rem` }}
              >
                <a href="#" className="flex items-center gap-2">
                  <File className="size-3" />
                  <span>{document.title}</span>
                </a>
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
                    onClick={() =>
                      handleDocumentAction(document.id, "duplicate")
                    }
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
    });
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Collections</SidebarGroupLabel>
      <SidebarGroupAction onClick={() => createNewCollection()}>
        <Plus className="size-4" />
        <span className="sr-only">Add Collection</span>
      </SidebarGroupAction>
      <SidebarGroupContent>
        <SidebarMenu>{renderCollectionTree()}</SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
