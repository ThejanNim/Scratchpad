"use client"

import * as React from "react"
import {
  ChevronRight,
  Folder,
  FolderOpen,
  File,
  Plus,
  Settings,
  Users,
  BookOpen,
  Star,
  Archive,
  MoreHorizontal,
  Trash2,
  Edit,
  Copy,
} from "lucide-react"

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [collections, setCollections] = React.useState([
    {
      id: "1",
      title: "Projects",
      icon: Folder,
      items: [
        { id: "1-1", title: "Website Redesign", icon: File, isActive: true },
        { id: "1-2", title: "Mobile App", icon: File },
        { id: "1-3", title: "API Documentation", icon: File },
        { id: "1-4", title: "Brand Guidelines", icon: File },
      ],
    },
    {
      id: "2",
      title: "Documents",
      icon: BookOpen,
      items: [
        { id: "2-1", title: "Meeting Notes", icon: File },
        { id: "2-2", title: "Requirements", icon: File },
        { id: "2-3", title: "Specifications", icon: File },
        { id: "2-4", title: "User Stories", icon: File },
        { id: "2-5", title: "Test Cases", icon: File },
      ],
    },
    {
      id: "3",
      title: "Team",
      icon: Users,
      items: [
        { id: "3-1", title: "Developers", icon: Users },
        { id: "3-2", title: "Designers", icon: Users },
        { id: "3-3", title: "Product Managers", icon: Users },
        { id: "3-4", title: "QA Engineers", icon: Users },
      ],
    },
    {
      id: "4",
      title: "Favorites",
      icon: Star,
      items: [
        { id: "4-1", title: "Dashboard Analytics", icon: File },
        { id: "4-2", title: "Component Library", icon: File },
        { id: "4-3", title: "Style Guide", icon: File },
      ],
    },
    {
      id: "5",
      title: "Archive",
      icon: Archive,
      items: [
        { id: "5-1", title: "Old Projects", icon: Folder },
        { id: "5-2", title: "Legacy Docs", icon: File },
        { id: "5-3", title: "Deprecated APIs", icon: File },
      ],
    },
  ])
  const [openSections, setOpenSections] = React.useState<string[]>(["Projects", "Documents"])

  const toggleSection = (title: string) => {
    setOpenSections((prev) => (prev.includes(title) ? prev.filter((section) => section !== title) : [...prev, title]))
  }

  const createNewCollection = () => {
    const newId = Date.now().toString()
    const newCollection = {
      id: newId,
      title: `New Collection ${collections.length + 1}`,
      icon: Folder,
      items: [],
    }
    setCollections([...collections, newCollection])
    setOpenSections((prev) => [...prev, newCollection.title])
  }

  const handleCollectionAction = (collectionId: string, action: "delete" | "rename" | "duplicate") => {
    switch (action) {
      case "delete":
        setCollections(collections.filter((c) => c.id !== collectionId))
        break
      case "rename":
        const newName = prompt("Enter new collection name:")
        if (newName) {
          setCollections(collections.map((c) => (c.id === collectionId ? { ...c, title: newName } : c)))
        }
        break
      case "duplicate":
        const collectionToDuplicate = collections.find((c) => c.id === collectionId)
        if (collectionToDuplicate) {
          const newId = Date.now().toString()
          const duplicatedCollection = {
            ...collectionToDuplicate,
            id: newId,
            title: `${collectionToDuplicate.title} Copy`,
            items: collectionToDuplicate.items.map((item) => ({
              ...item,
              id: `${newId}-${item.id.split("-")[1]}`,
            })),
          }
          setCollections([...collections, duplicatedCollection])
        }
        break
    }
  }

  const handleItemAction = (collectionId: string, itemId: string, action: "delete" | "rename" | "duplicate") => {
    switch (action) {
      case "delete":
        setCollections(
          collections.map((c) =>
            c.id === collectionId ? { ...c, items: c.items.filter((item) => item.id !== itemId) } : c,
          ),
        )
        break
      case "rename":
        const newName = prompt("Enter new item name:")
        if (newName) {
          setCollections(
            collections.map((c) =>
              c.id === collectionId
                ? {
                    ...c,
                    items: c.items.map((item) => (item.id === itemId ? { ...item, title: newName } : item)),
                  }
                : c,
            ),
          )
        }
        break
      case "duplicate":
        const collection = collections.find((c) => c.id === collectionId)
        const itemToDuplicate = collection?.items.find((item) => item.id === itemId)
        if (itemToDuplicate) {
          const newItemId = `${collectionId}-${Date.now()}`
          const duplicatedItem = {
            ...itemToDuplicate,
            id: newItemId,
            title: `${itemToDuplicate.title} Copy`,
            isActive: false,
          }
          setCollections(
            collections.map((c) => (c.id === collectionId ? { ...c, items: [...c.items, duplicatedItem] } : c)),
          )
        }
        break
    }
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <FolderOpen className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Workspace</span>
                  <span className="text-xs">Collections</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Collections</SidebarGroupLabel>
          <SidebarGroupAction onClick={createNewCollection}>
            <Plus className="size-4" />
            <span className="sr-only">Add Collection</span>
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {collections.map((collection) => {
                const isOpen = openSections.includes(collection.title)
                return (
                  <Collapsible
                    key={collection.id}
                    open={isOpen}
                    onOpenChange={() => toggleSection(collection.title)}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <div className="flex items-center group/collection-item">
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton className="flex-1">
                            <ChevronRight className="transition-transform group-data-[state=open]/collapsible:rotate-90" />
                            <collection.icon className="size-4" />
                            <span>{collection.title}</span>
                            <span className="ml-auto text-xs text-sidebar-foreground/70">
                              {collection.items.length}
                            </span>
                          </SidebarMenuButton>
                        </CollapsibleTrigger>

                        {/* Collection Actions Dropdown */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 opacity-0 group-hover/collection-item:opacity-100 transition-opacity"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className="h-3 w-3" />
                              <span className="sr-only">Collection options</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" side="right">
                            <DropdownMenuItem onClick={() => handleCollectionAction(collection.id, "rename")}>
                              <Edit className="h-4 w-4 mr-2" />
                              Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleCollectionAction(collection.id, "duplicate")}>
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleCollectionAction(collection.id, "delete")}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {collection.items.map((item) => (
                            <SidebarMenuSubItem key={item.id}>
                              <div className="flex items-center group/item w-full">
                                <SidebarMenuSubButton asChild isActive={item.isActive} className="flex-1">
                                  <a href="#" className="flex items-center gap-2">
                                    <item.icon className="size-3" />
                                    <span>{item.title}</span>
                                  </a>
                                </SidebarMenuSubButton>

                                {/* Item Actions Dropdown */}
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-5 w-5 p-0 opacity-0 group-hover/item:opacity-100 transition-opacity"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <MoreHorizontal className="h-3 w-3" />
                                      <span className="sr-only">Item options</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" side="right">
                                    <DropdownMenuItem
                                      onClick={() => handleItemAction(collection.id, item.id, "rename")}
                                    >
                                      <Edit className="h-4 w-4 mr-2" />
                                      Rename
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleItemAction(collection.id, item.id, "duplicate")}
                                    >
                                      <Copy className="h-4 w-4 mr-2" />
                                      Duplicate
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleItemAction(collection.id, item.id, "delete")}
                                      className="text-red-600 focus:text-red-600"
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="#" className="flex items-center gap-2">
                    <Plus className="size-4" />
                    <span>New Collection</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="#" className="flex items-center gap-2">
                    <Settings className="size-4" />
                    <span>Settings</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
