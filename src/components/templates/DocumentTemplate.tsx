"use client";

import useSWR from "swr";
import { Toaster } from "sonner";
import Header from "../molecules/Header/Header";
import { CommentsPanel } from "../ui/comments-panel";
import { useCallback, useEffect, useState } from "react";
import { useSidebar } from "../ui/sidebar";
import Editor from "../organisms/Editor/Editor";
import { supabase } from "@/lib/supabase/client";

interface DocumentTemplateProps {
  documentId: string;
}

interface Document {
  id: string;
  content: string;
  title: string;
  outline: string;
}

const fetchDoc = async (id: string) => {
  const { data, error } = await supabase
    .from("document")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
};

export default function DocumentTemplate({
  documentId
}: DocumentTemplateProps) {
  const { data, error, isLoading } = useSWR(["document", documentId], () => fetchDoc(documentId));

  const [isFocusMode, setIsFocusMode] = useState(false);
  const [commentsPanelOpen, setCommentsPanelOpen] = useState(true);
  const { setOpen: setMainSidebarOpen } = useSidebar();

  const toggleFocusMode = useCallback(() => {
    const newFocusMode = !isFocusMode;
    setIsFocusMode(newFocusMode);

    if (newFocusMode) {
      setMainSidebarOpen(false);
      setCommentsPanelOpen(false);
    } else {
      setMainSidebarOpen(true);
      setCommentsPanelOpen(true);
    }
  }, [isFocusMode, setMainSidebarOpen]);

   if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading document</p>;

  return (
    <>
      <div className="h-full flex flex-col w-full">
        <Header onFocusToggle={toggleFocusMode} />
        <div className="flex-1 flex flex-col justify-between overflow-y-hidden overflow-x-hidden">
          <Editor value={data?.content} documentId={data.id} />
          <Toaster />
        </div>
      </div>

      <CommentsPanel
        isOpen={commentsPanelOpen}
        onOpenChange={setCommentsPanelOpen}
        documentsData={data}
      />
    </>
  );
}
