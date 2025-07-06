import Editor from "@/components/organisms/Editor/Editor";
import { createClient } from "@/lib/supabase/server";
import { Toaster } from "sonner";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@radix-ui/react-separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { CommentsPanel } from "@/components/ui/comments-panel";

export default async function Document({
  params,
}: {
  params: Promise<{ document: string }>;
}) {
  const { document } = await params;
  const supabase = await createClient();

  const { data: documentsData, error: documentsError } = await supabase
    .from("document")
    .select("*")
    .eq("id", document)
    .single();

  return (
    <>
      {/* <ResizablePanel defaultSize={55} minSize={40}*/}
      <div className="h-full flex flex-col w-full">
        <header className="flex h-9 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
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
        </header>
        <div className="flex-1 flex flex-col justify-between overflow-y-hidden overflow-x-hidden">
          <Editor
            value={documentsData?.content}
            documentId={documentsData.id}
          />
          <Toaster />
        </div>
      </div>

      <CommentsPanel />
      
      {/* </ResizablePanel> */}

      {/* <ResizableHandle withHandle /> */}

      {/* <ResizablePanel defaultSize={18} minSize={20} maxSize={40}> */}
      
      

      {/* </ResizablePanel> */}
    </>
  );
}
