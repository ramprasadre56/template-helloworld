import { GoogleGenerativeAI } from "@google/generative-ai";
import { getSystemPrompt } from "@/lib/remotion/compositions";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || "");

export async function createChatSession(history: { role: string; content: string }[] = []) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const formattedHistory = history.map((msg) => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.content }],
  }));

  const chat = model.startChat({
    history: formattedHistory,
    generationConfig: {
      maxOutputTokens: 2048,
      temperature: 0.7,
    },
  });

  return chat;
}

export async function sendMessage(
  history: { role: string; content: string }[],
  message: string
) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  // Build the full conversation with system prompt
  const systemPrompt = getSystemPrompt();

  const formattedHistory = history.map((msg) => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.content }],
  }));

  const chat = model.startChat({
    history: [
      { role: "user", parts: [{ text: systemPrompt }] },
      {
        role: "model",
        parts: [
          {
            text: "I understand. I'm a video creation assistant ready to help users create professional videos using the available templates. I'll guide them through the process, recommend templates, help customize properties, and generate video configurations when they're ready. How can I help you create a video today?",
          },
        ],
      },
      ...formattedHistory,
    ],
    generationConfig: {
      maxOutputTokens: 2048,
      temperature: 0.7,
    },
  });

  const result = await chat.sendMessage(message);
  const response = await result.response;
  return response.text();
}

export function parseVideoConfig(response: string): {
  composition: string;
  title: string;
  props: Record<string, any>;
} | null {
  const match = response.match(/```video\n([\s\S]*?)\n```/);
  if (match) {
    try {
      return JSON.parse(match[1]);
    } catch (e) {
      console.error("Failed to parse video config:", e);
      return null;
    }
  }
  return null;
}
