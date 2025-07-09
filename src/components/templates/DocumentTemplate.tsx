"use client";

import { Toaster } from "sonner";
import Header from "../molecules/Header/Header";
import { CommentsPanel } from "../ui/comments-panel";
import { useCallback, useState } from "react";
import { useSidebar } from "../ui/sidebar";
import Editor from "../organisms/Editor/Editor";

interface DocumentTemplateProps {
  documentsData: {
    id: string;
    content: string;
    title: string;
    outline: string;
  };
}

export default function DocumentTemplate({
  documentsData,
}: DocumentTemplateProps) {
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

  return (
    <>
      <div className="h-full flex flex-col w-full">
        <Header onFocusToggle={toggleFocusMode} />
        <div className="flex-1 flex flex-col justify-between overflow-y-hidden overflow-x-hidden">
          <Editor
            value={documentsData?.content}
            documentId={documentsData.id}
          />
          <Toaster />
        </div>
      </div>

      <CommentsPanel isOpen={commentsPanelOpen}
        onOpenChange={setCommentsPanelOpen} documentsData={documentsData} />
    </>
  );
}
