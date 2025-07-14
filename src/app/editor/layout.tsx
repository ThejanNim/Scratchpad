import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import EditorLayout from "@/components/layouts/EditorLayout";
import {
  CollectionDocumentProvider,
} from "@/hooks/useCollectionDocument";

export default async function Layout({
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
    <CollectionDocumentProvider userId={user.id}>
      <EditorLayout
        user={user}
        handleSignOut={handleSignOut}
      >
        {children}
      </EditorLayout>
    </CollectionDocumentProvider>
  );
}
