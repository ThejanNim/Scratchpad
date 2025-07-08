import { createClient } from "@/lib/supabase/server";
import DocumentTemplate from "@/components/templates/DocumentTemplate";

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
      <DocumentTemplate documentsData={documentsData} />
    </>
  );
}
