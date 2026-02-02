import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { COMPOSITIONS } from "@/lib/remotion/compositions";
import { renderVideo, cleanupRender } from "@/lib/remotion/render";
import fs from "fs";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { compositionId, title, props } = await request.json();

    // Validate composition exists
    const composition = COMPOSITIONS[compositionId];
    if (!composition) {
      return NextResponse.json(
        { error: "Invalid composition" },
        { status: 400 }
      );
    }

    // Create video record
    const { data: video, error } = await supabase
      .from("videos")
      .insert({
        user_id: user.id,
        title: title || `${composition.name} Video`,
        composition_id: compositionId,
        input_props: props,
        status: "pending",
        duration_frames: composition.durationInFrames,
        fps: composition.fps,
        width: composition.width,
        height: composition.height,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Update status to rendering
    await supabase
      .from("videos")
      .update({ status: "rendering", progress: 10 })
      .eq("id", video.id);

    // Start the actual render process in background
    renderVideoAsync(video.id, compositionId, props, user.id);

    return NextResponse.json({
      videoId: video.id,
      status: "rendering",
    });
  } catch (error) {
    console.error("Render API error:", error);
    return NextResponse.json(
      { error: "Failed to start render" },
      { status: 500 }
    );
  }
}

// Background render function
async function renderVideoAsync(
  videoId: string,
  compositionId: string,
  props: Record<string, any>,
  userId: string
) {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  try {
    // Update progress
    await supabase
      .from("videos")
      .update({ progress: 30 })
      .eq("id", videoId);

    // Render the video
    const result = await renderVideo({
      compositionId,
      props,
    });

    if (!result.success || !result.outputPath) {
      throw new Error(result.error || "Render failed");
    }

    await supabase
      .from("videos")
      .update({ progress: 70 })
      .eq("id", videoId);

    // Read the rendered video file
    const videoBuffer = fs.readFileSync(result.outputPath);
    const fileName = `${userId}/${videoId}.mp4`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("videos")
      .upload(fileName, videoBuffer, {
        contentType: "video/mp4",
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("videos")
      .getPublicUrl(fileName);

    // Update video record with storage URL
    await supabase
      .from("videos")
      .update({
        status: "completed",
        progress: 100,
        storage_url: urlData.publicUrl,
        completed_at: new Date().toISOString(),
      })
      .eq("id", videoId);

    // Cleanup temp file
    await cleanupRender(result.outputPath);

    console.log(`Video ${videoId} rendered successfully`);
  } catch (error: any) {
    console.error(`Render failed for ${videoId}:`, error);

    // Update video record with error
    await supabase
      .from("videos")
      .update({
        status: "failed",
        error_message: error.message || "Unknown error",
      })
      .eq("id", videoId);
  }
}

// Get render progress
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get("videoId");

    if (!videoId) {
      return NextResponse.json(
        { error: "Video ID required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: video, error } = await supabase
      .from("videos")
      .select("id, status, progress, error_message, storage_url")
      .eq("id", videoId)
      .eq("user_id", user.id)
      .single();

    if (error || !video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    return NextResponse.json(video);
  } catch (error) {
    console.error("Render progress error:", error);
    return NextResponse.json(
      { error: "Failed to get progress" },
      { status: 500 }
    );
  }
}
