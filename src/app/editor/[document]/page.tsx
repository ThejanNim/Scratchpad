import DocumentTemplate from "@/components/templates/DocumentTemplate";

export default async function Document({
  params,
}: {
  params: { document: string }
}) {
  return <DocumentTemplate documentId={params.document} />
}
