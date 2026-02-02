import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { MessageSquare, Library, Play, Plus } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get user's recent videos
  const { data: videos } = await supabase
    .from("videos")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })
    .limit(5);

  // Get video stats
  const { count: totalVideos } = await supabase
    .from("videos")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user?.id);

  const { count: completedVideos } = await supabase
    .from("videos")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user?.id)
    .eq("status", "completed");

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.user_metadata?.full_name?.split(" ")[0] || "Creator"}!
        </h1>
        <p className="text-muted-foreground">
          Create stunning videos with AI-powered conversations.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Link
          href="/dashboard/chat"
          className="bg-primary text-primary-foreground rounded-xl p-6 hover:bg-primary/90 transition-colors group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Plus className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Create New Video</h3>
              <p className="text-sm opacity-90">
                Start a conversation to create your video
              </p>
            </div>
          </div>
        </Link>

        <Link
          href="/dashboard/library"
          className="bg-white border rounded-xl p-6 hover:border-primary/50 transition-colors group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Library className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">View Library</h3>
              <p className="text-sm text-muted-foreground">
                Browse all your created videos
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Play className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalVideos || 0}</p>
              <p className="text-sm text-muted-foreground">Total Videos</p>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{completedVideos || 0}</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Library className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">3</p>
              <p className="text-sm text-muted-foreground">Templates</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Videos */}
      <div className="bg-white border rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Recent Videos</h2>
          <Link
            href="/dashboard/library"
            className="text-sm text-primary hover:underline"
          >
            View all
          </Link>
        </div>

        {videos && videos.length > 0 ? (
          <div className="space-y-4">
            {videos.map((video) => (
              <div
                key={video.id}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
              >
                <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center">
                  <Play className="h-6 w-6 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{video.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {video.composition_id} •{" "}
                    {new Date(video.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    video.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : video.status === "rendering"
                      ? "bg-yellow-100 text-yellow-700"
                      : video.status === "failed"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {video.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Play className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No videos yet</p>
            <Link
              href="/dashboard/chat"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Create your first video
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
