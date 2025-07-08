"use client";

import { Plate, usePlateEditor } from "platejs/react";
import { EditorKit } from "./EditorKit";
import {
  EditorContainer,
  Editor as EditorComponent,
} from "@/components/organisms/Editor/elements/editor";
import { useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

interface EditorProps {
  value: any;
  documentId: string;
}

export default function Editor({ value, documentId }: EditorProps) {
  const editor = usePlateEditor({
    plugins: EditorKit,
    value,
  });

  const saveTimeoutRef = useRef<NodeJS.Timeout>(null);

  const saveToSupabase = useCallback(async (content: any) => {
    try {
      const supabase = createClient();
      
      const { error } = await supabase
        .from("document")
        .update({ 
          content: content,
          updated_at: new Date().toISOString()
        })
        .eq("id", documentId);

      if (error) {
        console.error('Error saving document:', error);
      } else {
        console.log('Document saved successfully to ID:', documentId, content);
      }
    } catch (error) {
      console.error('Error saving document:', error);
    }
  }, [documentId]);

  const handleChange = useCallback((newValue: any) => {
    const content = newValue.children || newValue;

    // Clear previous timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Debounced save
    saveTimeoutRef.current = setTimeout(() => {
      saveToSupabase(content.value);
    }, 2000);
  }, [saveToSupabase, documentId]);

  return (
    <Plate
      editor={editor}
      onChange={handleChange}
    >
      <EditorContainer>
        <EditorComponent variant="default" />
      </EditorContainer>
    </Plate>
  );
}
