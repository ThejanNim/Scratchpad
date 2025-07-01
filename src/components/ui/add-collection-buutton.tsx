"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { SidebarGroupAction } from "./sidebar";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTrigger } from "@radix-ui/react-dialog";

export function AddCollectionButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError("Collection name is required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const supabase = createClient();

      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("You must be signed in to create collections");
        return;
      }

      // Create new collection
      const { data, error: insertError } = await supabase
        .from("collection")
        .insert({
          name: name.trim(),
          parent_id: null, // Root level collection
        })
        .select()
        .single();

      if (insertError) {
        console.error("Error creating collection:", insertError);
        setError("Failed to create collection. Please try again.");
        return;
      }

      console.log("Collection created:", data);
      
      // Reset form and close dialog
      setName("");
      setIsOpen(false);
      
      // Refresh the page to show the new collection
      router.refresh();
      
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <SidebarGroupAction>
          <Plus className="size-4" />
          <span className="sr-only">Add Collection</span>
        </SidebarGroupAction>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        {/* <DialogHeader>
          <DialogTitle>Create New Collection</DialogTitle>
          <DialogDescription>
            Create a new collection to organize your documents.
          </DialogDescription>
        </DialogHeader> */}
        <form onSubmit={handleCreateCollection}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter collection name"
                className="col-span-3"
                disabled={isLoading}
              />
            </div>
            {error && (
              <div className="text-sm text-red-600 col-span-4">
                {error}
              </div>
            )}
          </div>
          {/* <DialogFooter> */}
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !name.trim()}>
              {isLoading ? "Creating..." : "Create Collection"}
            </Button>
          {/* </DialogFooter> */}
        </form>
      </DialogContent>
    </Dialog>
  );
}