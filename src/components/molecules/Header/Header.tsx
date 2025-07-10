"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Focus } from "lucide-react";

interface HeaderProps {
  onFocusToggle?: () => void;
}

export default function Header({ onFocusToggle }: HeaderProps) {
  return (
    <header className="flex shrink-0 h-(--header-height) items-center gap-2 border-b px-4 p-2">
      <SidebarTrigger className="-ml-1" />
      <div className="flex justify-between w-full">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="#">Collections</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Website Redesign</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Focus className="w-4 h-4" onClick={onFocusToggle} />
      </div>
    </header>
  );
}
