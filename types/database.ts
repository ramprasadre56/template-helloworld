export type VideoStatus = "pending" | "rendering" | "completed" | "failed";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  videos_created: number;
  storage_used_bytes: number;
  plan: "free" | "pro" | "enterprise";
}

export interface ChatSession {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  video_config: VideoConfig | null;
  created_at: string;
}

export interface VideoConfig {
  composition: string;
  title: string;
  props: Record<string, any>;
}

export interface Video {
  id: string;
  user_id: string;
  chat_message_id: string | null;
  title: string;
  description: string | null;
  composition_id: string;
  input_props: Record<string, any>;
  status: VideoStatus;
  render_id: string | null;
  progress: number;
  error_message: string | null;
  storage_path: string | null;
  storage_url: string | null;
  thumbnail_path: string | null;
  thumbnail_url: string | null;
  duration_frames: number | null;
  fps: number;
  width: number;
  height: number;
  file_size_bytes: number | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}
