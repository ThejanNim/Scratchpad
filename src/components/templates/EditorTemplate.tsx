import { Toaster } from "sonner";
import Editor from "../organisms/Editor/Editor";

interface EditorTemplatePerops {
    documentId: string;
    content: string;
}

export default function EditorTemplate({ documentId, content }: EditorTemplatePerops) {
  return (
    <div className="flex-1 flex flex-col justify-between overflow-y-hidden overflow-x-hidden">
      <Editor documentId={documentId} value={content} />
      <Toaster />
    </div>
  );
}
