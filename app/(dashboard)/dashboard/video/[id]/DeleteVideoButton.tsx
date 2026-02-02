"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Trash2, Loader2 } from "lucide-react";

export function DeleteVideoButton({ videoId }: { videoId: string }) {
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleDelete = async () => {
    setDeleting(true);

    try {
      const { error } = await supabase
        .from("videos")
        .delete()
        .eq("id", videoId);

      if (error) {
        throw error;
      }

      router.push("/dashboard/library");
      router.refresh();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete video. Please try again.");
      setDeleting(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Delete?</span>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="flex items-center gap-2 bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-red-600 disabled:opacity-50 transition-colors"
        >
          {deleting ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            "Yes, delete"
          )}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          className="px-3 py-1.5 rounded-lg text-sm font-medium border hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="flex items-center gap-2 border border-red-200 text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-50 transition-colors"
    >
      <Trash2 className="h-4 w-4" />
      Delete
    </button>
  );
}
