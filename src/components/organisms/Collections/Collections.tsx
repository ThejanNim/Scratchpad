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
} from "@/components/ui/sidebar";
import { Plus } from "lucide-react";
import {
  ICollection,
  IDocumentItem,
} from "@/components/organisms/AppSidebar/AppSidebar";
import CollectionTree from "@/components/molecules/CollectionTree/CollectionTree";
import { useUser } from "@/context/UserContext";

export default function Collections({
  collections: initialCollections,
  documents: initialDocuments,
}: {
  collections: ICollection[] | null;
  documents: IDocumentItem[] | null;
}) {
  // Add state management for collections and documents
  const [collections, setCollections] = React.useState<ICollection[] | null>(
    initialCollections
  );
  const [documents, setDocuments] = React.useState<IDocumentItem[] | null>(
    initialDocuments
  );
  const [openSections, setOpenSections] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();
  const user = useUser();

  // Update state when props change (when parent re-renders)
  React.useEffect(() => {
    setCollections(initialCollections);
  }, [initialCollections]);

  React.useEffect(() => {
    setDocuments(initialDocuments);
  }, [initialDocuments]);

  const buildTree = (
    parentId: string | null = null
  ): (ICollection | IDocumentItem)[] => {
    const items: (ICollection | IDocumentItem)[] = [];

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
          user_id: user.user?.id,
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

  const createNewDocument = async (collectionId: string) => {
    const documentTitle = prompt("Enter document title:");
    if (!documentTitle?.trim()) return;

    setIsLoading(true);
    try {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("document")
        .insert({
          title: documentTitle.trim(),
          collection_id: collectionId,
          content: [
            {
              type: "h1",
              children: [{ text: documentTitle.trim() }],
            },
          ],
        })
        .select()
        .single();

      if (error) throw error;

      // Update local state immediately
      setDocuments((prev) => [...(prev ?? []), data]);

      // Optionally refresh the page for full sync
      router.refresh();
    } catch (error) {
      console.error("Error creating document:", error);
      alert("Failed to create document");
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
          setCollections(
            (prev) => prev?.filter((c) => c.id !== collectionId) ?? []
          );
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
          setCollections(
            (prev) =>
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
    console.log("Document action:", action, documentId);
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Collections</SidebarGroupLabel>
      <SidebarGroupAction onClick={() => createNewCollection()}>
        <Plus className="size-4" />
        <span className="sr-only">Add Collection</span>
      </SidebarGroupAction>
      <SidebarGroupContent>
        <SidebarMenu>
          <CollectionTree
            buildTree={buildTree}
            parentId={null}
            openSections={openSections}
            collections={collections}
            documents={documents}
            handleCollectionAction={handleCollectionAction}
            createNewCollection={createNewCollection}
            createNewDocument={createNewDocument}
            toggleSection={toggleSection}
            isLoading={isLoading}
            handleDocumentAction={handleDocumentAction}
          />
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
