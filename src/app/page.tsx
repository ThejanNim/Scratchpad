import AppSidebar from "@/components/organisms/Sidebar/Sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { CommentsPanel } from "@/components/ui/comments-panel";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { UserContext, UserProvider } from "@/context/UserContext";
import Editor from "@/components/organisms/Editor/Editor";
import { Toaster } from "sonner";
import { TooltipProvider } from "@radix-ui/react-tooltip";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  const { data: collectionsData, error: collectionsError } = await supabase
    .from("collection")
    .select("*")
    .eq("user_id", user.id)
    .order("name");

  const { data: documentsData, error: documentsError } = await supabase
    .from("document")
    .select("*")
    .order("title");

  if (collectionsError) {
    console.error("Error fetching collections:", collectionsError);
  }

  if (documentsError) {
    console.error("Error fetching documents:", documentsError);
  }

  const handleSignOut = async (formData: FormData) => {
    "use server";
    const supabase = await createClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error signing out:", error);
      return;
    }

    redirect("/auth/sign-in");
  };

  return (
    <UserProvider user={user}>
      <SidebarProvider>
        <div className="flex h-screen w-full">
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={12} minSize={8} maxSize={35}>
              <div className="h-full flex flex-col">
                <AppSidebar
                  collections={collectionsData}
                  documents={documentsData}
                  user={user}
                  handleSignOut={handleSignOut}
                />
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={55} minSize={40}>
              <div className="h-full flex flex-col">
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
                <div className="flex-1 flex flex-col justify-between overflow-hidden">
                  <Editor />
                  <Toaster />
                </div>
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={18} minSize={20} maxSize={40}>
              <CommentsPanel />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </SidebarProvider>
    </UserProvider>
  );
}
