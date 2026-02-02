import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  ArrowLeft,
  Download,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Film,
  Calendar,
  Palette,
} from "lucide-react";
import { DeleteVideoButton } from "./DeleteVideoButton";

export default async function VideoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: video, error } = await supabase
    .from("videos")
    .select("*")
    .eq("id", id)
    .eq("user_id", user?.id)
    .single();

  if (error || !video) {
    notFound();
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "rendering":
        return <Loader2 className="h-5 w-5 text-yellow-500 animate-spin" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const formatDuration = (frames: number, fps: number) => {
    const seconds = Math.round(frames / fps);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  return (
    <div className="p-8 max-w-5xl">
      {/* Back link */}
      <Link
        href="/dashboard/library"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Library
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Video Preview */}
        <div className="lg:col-span-2">
          <div className="bg-white border rounded-xl overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              {video.status === "completed" && video.storage_url ? (
                <video
                  src={video.storage_url}
                  controls
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-center">
                  <Film className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {video.status === "rendering"
                      ? "Video is being rendered..."
                      : video.status === "failed"
                      ? "Rendering failed"
                      : "Preview not available"}
                  </p>
                  {video.status === "rendering" && (
                    <div className="mt-4 w-48 mx-auto">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-300"
                          style={{ width: `${video.progress || 0}%` }}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        {video.progress || 0}% complete
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="p-4 border-t flex items-center gap-3">
              {video.status === "completed" && video.storage_url && (
                <a
                  href={video.storage_url}
                  download={`${video.title}.mp4`}
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Download
                </a>
              )}
              <DeleteVideoButton videoId={video.id} />
            </div>
          </div>
        </div>

        {/* Video Details */}
        <div className="space-y-6">
          {/* Title & Status */}
          <div className="bg-white border rounded-xl p-6">
            <h1 className="text-2xl font-bold mb-4">{video.title}</h1>
            <div className="flex items-center gap-2 mb-4">
              {getStatusIcon(video.status)}
              <span className="font-medium capitalize">{video.status}</span>
            </div>
            {video.description && (
              <p className="text-muted-foreground">{video.description}</p>
            )}
          </div>

          {/* Metadata */}
          <div className="bg-white border rounded-xl p-6 space-y-4">
            <h2 className="font-semibold">Details</h2>

            <div className="flex items-center gap-3">
              <Film className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Template</p>
                <p className="font-medium">{video.composition_id}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="font-medium">
                  {video.duration_frames && video.fps
                    ? formatDuration(video.duration_frames, video.fps)
                    : "—"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="font-medium">
                  {new Date(video.created_at).toLocaleString()}
                </p>
              </div>
            </div>

            {video.completed_at && (
              <div className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="font-medium">
                    {new Date(video.completed_at).toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Props */}
          {video.input_props && Object.keys(video.input_props).length > 0 && (
            <div className="bg-white border rounded-xl p-6">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Properties
              </h2>
              <div className="space-y-3">
                {Object.entries(video.input_props).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-muted-foreground capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                    {typeof value === "string" && value.startsWith("#") ? (
                      <div className="flex items-center gap-2">
                        <div
                          className="w-5 h-5 rounded border"
                          style={{ backgroundColor: value }}
                        />
                        <span className="font-mono text-xs">{value}</span>
                      </div>
                    ) : (
                      <span className="font-medium">{String(value)}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error message */}
          {video.status === "failed" && video.error_message && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <h2 className="font-semibold text-red-800 mb-2">Error</h2>
              <p className="text-sm text-red-700">{video.error_message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
