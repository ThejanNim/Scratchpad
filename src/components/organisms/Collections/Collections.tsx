"use client";

import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { Plus } from "lucide-react";
import CollectionTree from "@/components/molecules/CollectionTree/CollectionTree";
import { useCollections } from "./useCollections";
import { useCollectionDocument } from "@/hooks/useCollectionDocument";
import { useUser } from "@/context/UserContext";

export default function Collections() {
  const {
    collectionsData,
    documentsData,
    openSections,
    isLoading,
    toggleSection,
    buildTree,
  } = useCollections();

  const { createCollection } = useCollectionDocument();
  const user = useUser();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Collections</SidebarGroupLabel>
      <SidebarGroupAction
        onClick={() => {
          const collectionName = prompt("Enter collection name:");
          createCollection({
            collectionName: collectionName || "New Collection",
            parentId: null,
            userId: user.user?.id || "",
          });
        }}
      >
        <Plus className="size-4" />
        <span className="sr-only">Add Collection</span>
      </SidebarGroupAction>
      <SidebarGroupContent>
        <SidebarMenu>
          <CollectionTree
            buildTree={buildTree}
            parentId={null}
            openSections={openSections}
            collections={collectionsData}
            documents={documentsData}
            toggleSection={toggleSection}
            isLoading={isLoading}
            handleDocumentAction={() => {}}
          />
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

// export default withCollectionsProvider(Collections);
