"use client";

import { useState, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Send,
  Loader2,
  Play,
  Sparkles,
  Video,
  RefreshCw,
} from "lucide-react";
import { COMPOSITIONS } from "@/lib/remotion/compositions";

interface Message {
  role: "user" | "assistant";
  content: string;
  videoConfig?: {
    composition: string;
    title: string;
    props: Record<string, any>;
  } | null;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [renderingVideo, setRenderingVideo] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Create new session on mount
  useEffect(() => {
    createSession();
  }, []);

  const createSession = async () => {
    try {
      const response = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "New Video Chat" }),
      });
      const data = await response.json();
      if (data.id) {
        setSessionId(data.id);
      }
    } catch (error) {
      console.error("Failed to create session:", error);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          sessionId,
          history: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: data.message,
        videoConfig: data.videoConfig,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateVideo = async (
    config: NonNullable<Message["videoConfig"]>
  ) => {
    setRenderingVideo(true);

    try {
      // Call the render API to actually render the video
      const response = await fetch("/api/render", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          compositionId: config.composition,
          title: config.title,
          props: config.props,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to start render");
      }

      const { videoId } = await response.json();

      setRenderingVideo(false);
      alert(
        `Video rendering started! Check your library to view progress. Video ID: ${videoId}`
      );
    } catch (error) {
      console.error("Video generation error:", error);
      setRenderingVideo(false);
      alert("Failed to generate video. Please try again.");
    }
  };

  const startNewChat = () => {
    setMessages([]);
    createSession();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b bg-white px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Create Video</h1>
          <p className="text-sm text-muted-foreground">
            Chat with AI to create your video
          </p>
        </div>
        <button
          onClick={startNewChat}
          className="flex items-center gap-2 px-4 py-2 text-sm border rounded-lg hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          New Chat
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">
              What video would you like to create?
            </h2>
            <p className="text-muted-foreground max-w-md mb-8">
              Describe your video idea and I&apos;ll help you bring it to life
              using our professional templates.
            </p>
            <div className="grid gap-3 max-w-lg w-full">
              {[
                "Create a welcome video for my company",
                "Make a product demo video with blue colors",
                "I need an educational explainer video",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setInput(suggestion)}
                  className="text-left px-4 py-3 border rounded-lg hover:border-primary/50 hover:bg-gray-50 transition-colors text-sm"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6 max-w-3xl mx-auto">
            {messages.map((message, index) => (
              <div key={index}>
                <div
                  className={`flex gap-4 ${
                    message.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-gray-100"
                    }`}
                  >
                    {message.role === "user" ? (
                      "U"
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )}
                  </div>
                  <div
                    className={`flex-1 ${
                      message.role === "user" ? "text-right" : ""
                    }`}
                  >
                    <div
                      className={`inline-block max-w-[85%] px-4 py-3 rounded-2xl ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-gray-100"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">
                        {message.content.replace(/```video[\s\S]*?```/g, "").trim()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Video Config Card */}
                {message.videoConfig && (
                  <div className="mt-4 ml-12 max-w-md">
                    <div className="border rounded-xl p-4 bg-gradient-to-br from-primary/5 to-primary/10">
                      <div className="flex items-center gap-2 mb-3">
                        <Video className="h-5 w-5 text-primary" />
                        <span className="font-semibold">
                          Ready to Generate
                        </span>
                      </div>
                      <div className="space-y-2 text-sm mb-4">
                        <p>
                          <span className="text-muted-foreground">Title:</span>{" "}
                          {message.videoConfig.title}
                        </p>
                        <p>
                          <span className="text-muted-foreground">
                            Template:
                          </span>{" "}
                          {COMPOSITIONS[message.videoConfig.composition]?.name ||
                            message.videoConfig.composition}
                        </p>
                        <p>
                          <span className="text-muted-foreground">
                            Duration:
                          </span>{" "}
                          {(COMPOSITIONS[message.videoConfig.composition]
                            ?.durationInFrames || 0) /
                            (COMPOSITIONS[message.videoConfig.composition]
                              ?.fps || 30)}
                          s
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          handleGenerateVideo(message.videoConfig!)
                        }
                        disabled={renderingVideo}
                        className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {renderingVideo ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4" />
                            Generate Video
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="bg-gray-100 px-4 py-3 rounded-2xl">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t bg-white p-4">
        <form
          onSubmit={sendMessage}
          className="max-w-3xl mx-auto flex items-center gap-4"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your video idea..."
            className="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-primary text-primary-foreground p-3 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
