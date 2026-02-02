import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  Play,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Plus,
  Film,
} from "lucide-react";

export default async function LibraryPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: videos, error } = await supabase
    .from("videos")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "rendering":
        return <Loader2 className="h-4 w-4 text-yellow-500 animate-spin" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      completed: "bg-green-100 text-green-700",
      rendering: "bg-yellow-100 text-yellow-700",
      failed: "bg-red-100 text-red-700",
      pending: "bg-gray-100 text-gray-700",
    };
    return styles[status] || styles.pending;
  };

  const formatDuration = (frames: number, fps: number) => {
    const seconds = Math.round(frames / fps);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Video Library</h1>
          <p className="text-muted-foreground">
            All your created videos in one place.
          </p>
        </div>
        <Link
          href="/dashboard/chat"
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Create Video
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {["All", "Completed", "Rendering", "Failed"].map((filter) => (
          <button
            key={filter}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              filter === "All"
                ? "bg-primary text-primary-foreground"
                : "bg-white border hover:bg-gray-50"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Videos Grid */}
      {videos && videos.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <Link
              key={video.id}
              href={`/dashboard/video/${video.id}`}
              className="bg-white border rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all group"
            >
              {/* Thumbnail */}
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative">
                <Film className="h-12 w-12 text-gray-300" />
                {video.status === "completed" && (
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="h-6 w-6 text-primary fill-primary" />
                    </div>
                  </div>
                )}
                {/* Status badge */}
                <div
                  className={`absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                    video.status
                  )}`}
                >
                  {getStatusIcon(video.status)}
                  {video.status}
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-semibold truncate mb-1">{video.title}</h3>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span>{video.composition_id}</span>
                  <span>•</span>
                  <span>
                    {video.duration_frames && video.fps
                      ? formatDuration(video.duration_frames, video.fps)
                      : "—"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Created {new Date(video.created_at).toLocaleDateString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white border rounded-xl p-12 text-center">
          <Film className="h-16 w-16 text-gray-200 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No videos yet</h2>
          <p className="text-muted-foreground mb-6">
            Start creating videos using our AI-powered chat interface.
          </p>
          <Link
            href="/dashboard/chat"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create Your First Video
          </Link>
        </div>
      )}
    </div>
  );
}
