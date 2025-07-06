import { SidebarProvider } from "@/components/ui/sidebar";
import { UserProvider } from "@/context/UserContext";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import AppSidebar from "@/components/organisms/Sidebar/Sidebar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
            {children}
          </ResizablePanelGroup>
        </div>
      </SidebarProvider>
    </UserProvider>
  );
}
