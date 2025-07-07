import {
  ICollection,
  IDocumentItem,
} from "@/components/organisms/AppSidebar/AppSidebar";
import DocumentItem, { DocumentItemProps } from "../DocumentItem/DocumentItem";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/components/ui/sidebar";
import {
  ChevronRight,
  Copy,
  Edit,
  Folder,
  MoreVertical,
  Plus,
  Trash2,
  File
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface CollectionTreeProps extends Pick<DocumentItemProps, 'level' | 'isLoading' | 'handleDocumentAction'> {
  buildTree: (parentId: string | null) => (ICollection | IDocumentItem)[];
  parentId: string | null;
  openSections: string[];
  collections: ICollection[] | null;
  documents: IDocumentItem[] | null;
  handleCollectionAction: (
    collectionId: string,
    action: "rename" | "duplicate" | "delete"
  ) => void;
  createNewCollection: (parentId?: string) => void;
  createNewDocument: (collectionId: string) => void;
  toggleSection: (sectionId: string) => void;
}

export default function CollectionTree({
  buildTree,
  parentId,
  openSections,
  collections,
  documents,
  level = 0,
  isLoading,
  handleDocumentAction,
  handleCollectionAction,
  createNewCollection,
  createNewDocument,
  toggleSection,
}: CollectionTreeProps) {
  const items = buildTree(parentId);

  return items.map((item) => {
    const isCollection = "parent_id" in item && !("collection_id" in item);
    const isOpen = openSections.includes(item.id);

    if (isCollection) {
      const collection = item as ICollection;
      const hasChildren =
        collections?.some((c) => c.parent_id === collection.id) ||
        (documents?.some((d) => d.collection_id === collection.id) ?? false);

      return (
        <Collapsible
          key={collection.id}
          open={isOpen}
          onOpenChange={() => toggleSection(collection.id)}
          className="group/collapsible pl-2"
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
                    <MoreVertical className="h-3 w-3" />
                    <span className="sr-only">Collection options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" side="right">
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

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 opacity-0 group-hover/collection-item:opacity-100 transition-opacity"
                    onClick={(e) => e.stopPropagation()}
                    disabled={isLoading}
                  >
                    <Plus className="h-3 w-3" />
                    <span className="sr-only">Collection options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" side="right">
                  <DropdownMenuItem
                    onClick={() => createNewDocument(collection.id)}
                    disabled={isLoading}
                  >
                    <File className="h-4 w-4 mr-2" />
                    Add a doc
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => createNewCollection(collection.id)}
                    disabled={isLoading}
                  >
                    <Folder className="h-4 w-4 mr-2" />
                    Add a collection
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <CollapsibleContent>
              <SidebarMenuSub>
                <CollectionTree
                  parentId={collection.id}
                  level={level + 1}
                  {...{
                    buildTree,
                    openSections,
                    collections,
                    documents,
                    isLoading,
                    handleDocumentAction,
                    handleCollectionAction,
                    createNewCollection,
                    createNewDocument,
                    toggleSection,
                  }}
                />
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      );
    } else {
      const document = item as IDocumentItem;

      return (
        <DocumentItem
          key={document.id}
          document={document}
          level={level}
          isLoading={isLoading}
          handleDocumentAction={handleDocumentAction}
        />
      );
    }
  });
}
