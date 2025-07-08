'use client'

import './styles.css'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { EditorProvider, useCurrentEditor } from '@tiptap/react'
import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import { createClient } from '@/lib/supabase/client'

const MenuBar = () => {
  const { editor } = useCurrentEditor()

  if (!editor) {
    return null
  }

  return (
    <div className="control-group">
      <div className="button-group">
        <button
          onClick={() => {
            editor.chain().focus().toggleBulletList().run()
            console.log("Bullet")
          }}
          className={editor.isActive('bulletList') ? 'is-active' : ''}
        >
          Bullet list
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'is-active' : ''}
        >
          Ordered list
        </button>
      </div>
    </div>
  )
}

const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure(),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
  }),
]

interface TipTapProps {
  documentsData: {
    id: string;
    content: string;
    title: string;
    outline: string;
  };
}

export default function TipTap({ documentsData }: TipTapProps) {
  const supabase = createClient();

  const editor = useEditor({
    extensions,
    content: documentsData.outline,
    onUpdate: async ({ editor }) => {
      try {
        console.log("hii", editor.getJSON());

        const { error } = await supabase
          .from("document")
          .update({
            outline: editor.getJSON(),
            updated_at: new Date().toISOString()
          })
          .eq("id", documentsData.id);

        if (error) {
          console.error('Error saving document:', error);
        } else {
          console.log('Document saved successfully to ID:', documentsData.id);
        }
      } catch (error) {
        console.error('Error saving document:', error);
      }
    },
  });

  return (
    <>
      {/* <MenuBar /> */}
      <EditorContent editor={editor} />
    </>
  );
}