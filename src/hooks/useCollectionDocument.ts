"use client";

import { supabase } from "@/lib/supabase/client";
import constate from "constate";
import useSWR from "swr";

interface CollectionDocumentProviderProps {
  userId: string;
}

export const [CollectionDocumentProvider, useCollectionDocument] = constate(
  ({ userId }: CollectionDocumentProviderProps) => {
    const fetchCollections = async () => {
      const { data, error } = await supabase
        .from("collection")
        .select("*")
        .eq("user_id", userId)
        .order("name");

      if (error) throw error;
      return data;
    };

    const fetchDocuments = async (collectionsData: any) => {
      const { data, error } = await supabase
        .from("document")
        .select("*")
        .in("collection_id", collectionsData?.map((c: any) => c.id) || [])
        .order("title");

      if (error) throw error;
      return data;
    };

    const {
      data: collectionsData,
      error: collectionsError,
      mutate: mutateCollections,
    } = useSWR(["collections", userId], fetchCollections);

    const {
      data: documentsData,
      error: documentsError,
      mutate: mutateDocuments,
    } = useSWR(["documents", collectionsData], () =>
      fetchDocuments(collectionsData)
    );

    const createCollection = async ({ collectionName, parentId, userId }: {
        collectionName: string;
        parentId?: string | null;
        userId: string;
    }) => {
      try {
        const { data, error } = await supabase
        .from("collection")
        .insert({
          name: collectionName,
          parent_id: parentId || null,
          user_id: userId,
        })
        .select()
        .single();

        if (error) throw error;

        mutateCollections();

        return { success: true, data };
      } catch (error) {
        console.error("Error creating collection:", error);
        return { success: false, error };
      }
    };

    const createDocument = async ({
      collection_id,
      title,
    }: {
      collection_id: string;
      title: string;
    }) => {
      try {
        const { data, error } = await supabase
          .from("document")
          .insert([
            {
              collection_id,
              title,
              content: [],
            },
          ])
          .select()
          .single();

        if (error) throw error;

        // Refresh documents data
        mutateDocuments();

        return { success: true, data };
      } catch (error) {
        console.error("Error creating document:", error);
        return { success: false, error };
      }
    };

    const updateDocumentTitle = async ({
      id,
      title,
    }: {
      id: string;
      title: string;
    }) => {
      try {
        // Optimistic update - update UI immediately
        mutateDocuments(
          (currentDocuments: any[] | undefined) =>
            currentDocuments?.map((doc) =>
              doc.id === id ? { ...doc, title } : doc
            ) || [],
          false // Don't revalidate immediately
        );

        // Update in database
        const { error } = await supabase
          .from("document")
          .update({ title })
          .eq("id", id);

        if (error) throw error;

        // Revalidate to ensure data is in sync
        mutateDocuments();

        return { success: true };
      } catch (error) {
        console.error("Error updating document title:", error);
        // Revert optimistic update on error
        mutateDocuments();
        return { success: false, error };
      }
    };

    return {
      collectionsData,
      collectionsError,
      documentsData,
      documentsError,
      createCollection,
      createDocument,
      updateDocumentTitle,
    };
  }
);
