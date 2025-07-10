import DocumentTemplate from "@/components/templates/DocumentTemplate";

export default async function Document({
  params,
}: {
  params: Promise<{ document: string }>;
}) {
  const { document } = await params;
    
  return <DocumentTemplate documentId={document} />
}
