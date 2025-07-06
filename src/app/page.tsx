// "use client"

// import { useRouter } from "next/navigation";
// import { useEffect } from "react";

// export default function Home() {
//   const router = useRouter();

//   useEffect(() => {
//     const dynamicDocId = localStorage.getItem('lastVisitedDocId') || 'editor/b910ea57-74c5-456d-b516-6bd5e6c28604'; // Replace with your actual logic

//     if (dynamicDocId) {
//       router.push(`/${dynamicDocId}`);
//     }
//   }, [router]);

//   return <></>;
// }

// export async function getServerSideProps() {
  // Generate a new document ID
  // const generateDocumentId = () => {
  //   return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  // };

  // const documentId = generateDocumentId();

  // return {
  //   redirect: {
  //     destination: `/editor/${documentId}`,
  //     permanent: false, // Set to true if this is a permanent redirect
  //   },
  // };
// }

// This component will never actually render due to the redirect
export default async function HomePage() {
  return <h1>HomePage</h1>;
}