import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import EditorTemplate from "@/components/templates/SidebarTemplate";

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
    <EditorTemplate
      user={user}
      collectionsData={collectionsData || []}
      documentsData={documentsData || []}
      handleSignOut={handleSignOut}
    >
      {children}
    </EditorTemplate>
  );
}
