"use client";

import { Plate, usePlateEditor } from "platejs/react";
import { EditorKit } from "./EditorKit";
import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  EditorContainer,
  Editor as EditorComponent,
} from "./PlateEditor/editor";
import { useCollectionDocument } from "@/hooks/useCollectionDocument";

interface EditorProps {
  value: any;
  documentId: string;
}

interface EditableHeadingProps {
  documentId: string;
}

const EditableHeading = ({ documentId }: EditableHeadingProps) => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [title, setTitle] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const updateTimeoutRef = useRef<NodeJS.Timeout>(null);

  const { updateDocumentTitle, documentsData } = useCollectionDocument();

  const currentDocument = documentsData?.find((doc: any) => doc.id === documentId);
  const currentTitle = currentDocument?.title || "New Document";

  const debouncedUpdate = useCallback((newTitle: string) => {
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    
    updateTimeoutRef.current = setTimeout(() => {
      updateDocumentTitle({ id: documentId, title: newTitle || "New Document" });
    }, 80);
  }, [documentId, updateDocumentTitle]);

  useEffect(() => {
    const handleInput = (e: Event) => {
      const target = e.target as HTMLHeadingElement;
      const newTitle = target.innerText?.trim() || "";
      setTitle(newTitle);
      debouncedUpdate(newTitle);
    };

    const handleFocus = () => {
      setIsEditing(true);
    };

    const handleBlur = () => {
      setIsEditing(false);
    };

    const element = headingRef.current;
    if (element) {
      element.addEventListener('input', handleInput);
      element.addEventListener('focus', handleFocus);
      element.addEventListener('blur', handleBlur);
    }

    return () => {
      if (element) {
        element.removeEventListener('input', handleInput);
        element.removeEventListener('focus', handleFocus);
        element.removeEventListener('blur', handleBlur);
      }
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, [debouncedUpdate]);

  // Set initial title when document loads
  useEffect(() => {
    if (headingRef.current && currentTitle && !isEditing) {
      headingRef.current.innerText = currentTitle !== 'New Document' ? currentTitle : '' ;
      setTitle(currentTitle);
    }
  }, [currentTitle, isEditing]);

  const showPlaceholder = !title || title === "New Document";

  return (
    <h1
      ref={headingRef}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      data-placeholder="New Document"
      className={`capitalize sm:px-[max(64px,calc(50%-350px))] font-heading text-[40px] font-bold relative w-full outline-none max-w-full whitespace-pre-wrap break-words p-[3px_2px_0px] text-[1em] font-inherit m-0 min-h-[1em] text-[rgb(50,48,44)] caret-[rgb(50,48,44)] cursor-text ${
        showPlaceholder ? "before:absolute before:text-[rgba(55,53,47,0.15)] before:content-[attr(data-placeholder)] before:pointer-events-none" : ""
      }`}
      style={{
        direction: 'ltr', // Ensure left-to-right text direction
        unicodeBidi: 'plaintext'
      }}
    />
  );
};

export default function Editor({ value, documentId }: EditorProps) {
  const editor = usePlateEditor({
    plugins: EditorKit,
    value,
  });

  const saveTimeoutRef = useRef<NodeJS.Timeout>(null);

  const saveToSupabase = useCallback(
    async (content: any) => {
      try {
        const supabase = createClient();

        const { error } = await supabase
          .from("document")
          .update({
            content: content,
            updated_at: new Date().toISOString(),
          })
          .eq("id", documentId);

        if (error) {
          console.error("Error saving document:", error);
        } else {
          console.log(
            "Document saved successfully to ID:",
            documentId,
            content
          );
        }
      } catch (error) {
        console.error("Error saving document:", error);
      }
    },
    [documentId]
  );

  const handleChange = useCallback(
    (newValue: any) => {
      const content = newValue.children || newValue;

      // Clear previous timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Debounced save
      saveTimeoutRef.current = setTimeout(() => {
        saveToSupabase(content.value);
      }, 1000);
    },
    [saveToSupabase]
  );

  return (
    <Plate editor={editor} onChange={handleChange}>
      <EditorContainer>
        <EditableHeading documentId={documentId} />
        <EditorComponent variant="default" />
      </EditorContainer>
    </Plate>
  );
}


