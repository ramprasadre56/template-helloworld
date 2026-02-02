import { createClient } from "@/lib/supabase/server";
import { sendMessage, parseVideoConfig } from "@/lib/gemini/client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { message, sessionId, history } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Get AI response
    const aiResponse = await sendMessage(history || [], message);

    // Parse for video config
    const videoConfig = parseVideoConfig(aiResponse);

    // Save messages to database if sessionId provided
    if (sessionId) {
      // Save user message
      await supabase.from("chat_messages").insert({
        session_id: sessionId,
        role: "user",
        content: message,
      });

      // Save assistant message
      await supabase.from("chat_messages").insert({
        session_id: sessionId,
        role: "assistant",
        content: aiResponse,
        video_config: videoConfig,
      });

      // Update session timestamp
      await supabase
        .from("chat_sessions")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", sessionId);
    }

    return NextResponse.json({
      message: aiResponse,
      videoConfig,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    );
  }
}
