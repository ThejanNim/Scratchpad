"use client";

import { useCollectionDocument } from "@/hooks/useCollectionDocument";
import { use } from "react";
import EditorTemplate from "@/components/templates/EditorTemplate";

export default function Document({
  params,
}: {
  params: Promise<{ document: string }>;
}) {
  const { document } = use(params);
  const { documentsData } = useCollectionDocument();

  const currentDocument = documentsData?.find(
    (doc: any) => doc.id === document
  );

  return (
    <EditorTemplate documentId={document} content={currentDocument?.content} />
  );
}
