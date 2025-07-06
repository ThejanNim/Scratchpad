import { redirect } from 'next/navigation';

function generateDocumentId(): string {
  return "cd4d247c-999a-4137-83e1-5b1d4103812b";
}

export default function HomePage() {
  const documentId = generateDocumentId();
  redirect(`/editor/${documentId}`);
}