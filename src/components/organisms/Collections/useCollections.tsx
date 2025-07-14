import constate from "constate";
import { ICollection, IDocumentItem } from "../AppSidebar/AppSidebar";
import { useEffect, useState } from "react";
import { useCollectionDocument } from "@/hooks/useCollectionDocument";

// type CollectionsProviderProps = React.PropsWithChildren<{
//   collections: ICollection[] | null;
//   documents: IDocumentItem[] | null;
// }>;

export const [CollectionsProvider, useCollections] = constate(
  () => {
    const { collectionsData, documentsData } = useCollectionDocument();

    const [openSections, setOpenSections] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
      const savedOpenSections = localStorage.getItem(
        "collection-open-sections"
      );
      if (savedOpenSections) {
        try {
          const parsedSections = JSON.parse(savedOpenSections);
          setOpenSections(parsedSections);
        } catch (error) {
          console.error("Error parsing saved open sections:", error);
        }
      }
      setIsHydrated(true);
    }, []);

    // Save openSections to localStorage whenever it changes
    useEffect(() => {
      if (isHydrated) {
        localStorage.setItem(
          "collection-open-sections",
          JSON.stringify(openSections)
        );
      }
    }, [openSections, isHydrated]);


    const toggleSection = (collectionId: string) => {
      setOpenSections((prev) =>
        prev.includes(collectionId)
          ? prev.filter((id) => id !== collectionId)
          : [...prev, collectionId]
      );
    };

    const buildTree = (
      parentId: string | null = null
    ): (ICollection | IDocumentItem)[] => {
      const items: (ICollection | IDocumentItem)[] = [];

      // Add child collections
      const childCollections = collectionsData?.filter(
        (c) => c.parent_id === parentId
      );

      if (childCollections) {
        items.push(...childCollections);
      }

      // Add documents for this collection
      if (parentId) {
        const collectionDocuments = documentsData?.filter(
          (d) => d.collection_id === parentId
        );
        if (collectionDocuments) {
          items.push(...collectionDocuments);
        }
      }

      return items;
    };

    return {
      collectionsData,
      documentsData,
      openSections,
      isLoading,
      toggleSection,
      buildTree,
    };
  }
);

// function withCollectionsProvider(Component: React.FC) {
//   return function CollectionsProviderWrapper(props: any) {

//     return (
//       <CollectionsProvider {...props}>
//         <Component />
//       </CollectionsProvider>
//     );
//   };
// }

// export default withCollectionsProvider;
