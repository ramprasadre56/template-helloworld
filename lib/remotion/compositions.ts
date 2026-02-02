// Composition registry for the chat AI to understand available templates

export interface CompositionConfig {
  id: string;
  name: string;
  description: string;
  durationInFrames: number;
  fps: number;
  width: number;
  height: number;
  props: {
    name: string;
    type: "string" | "color" | "number";
    description: string;
    default: string | number;
  }[];
}

export const COMPOSITIONS: Record<string, CompositionConfig> = {
  HelloWorld: {
    id: "HelloWorld",
    name: "Hello World",
    description:
      "A simple animated greeting video with customizable title and logo colors. Perfect for welcome messages and introductions.",
    durationInFrames: 150,
    fps: 30,
    width: 1920,
    height: 1080,
    props: [
      {
        name: "titleText",
        type: "string",
        description: "The main title text displayed in the video",
        default: "Welcome to Remotion",
      },
      {
        name: "titleColor",
        type: "color",
        description: "Color of the title text",
        default: "#000000",
      },
      {
        name: "logoColor1",
        type: "color",
        description: "First gradient color for the logo",
        default: "#91EAE4",
      },
      {
        name: "logoColor2",
        type: "color",
        description: "Second gradient color for the logo",
        default: "#86A8E7",
      },
    ],
  },
  BookedInDemo: {
    id: "BookedInDemo",
    name: "Product Demo",
    description:
      "A professional product demo video template (19 seconds). Includes intro, tagline, features showcase, stats, and call-to-action scenes.",
    durationInFrames: 570,
    fps: 30,
    width: 1920,
    height: 1080,
    props: [
      {
        name: "accentColor",
        type: "color",
        description: "Brand accent color used throughout the video",
        default: "#2563EB",
      },
    ],
  },
  BhagavataPradipika: {
    id: "BhagavataPradipika",
    name: "Magazine Explainer",
    description:
      "A magazine-style educational video (90 seconds). Features title scene, founder message, content sections, verse highlight, analogies, and closing.",
    durationInFrames: 2700,
    fps: 30,
    width: 1920,
    height: 1080,
    props: [
      {
        name: "primaryColor",
        type: "color",
        description: "Primary theme color",
        default: "#F4A460",
      },
      {
        name: "accentColor",
        type: "color",
        description: "Secondary accent color",
        default: "#8B0000",
      },
    ],
  },
};

export function getCompositionById(id: string): CompositionConfig | undefined {
  return COMPOSITIONS[id];
}

export function getAllCompositions(): CompositionConfig[] {
  return Object.values(COMPOSITIONS);
}

export function getSystemPrompt(): string {
  const compositions = getAllCompositions();

  const compositionDescriptions = compositions
    .map((comp) => {
      const propsList = comp.props
        .map(
          (p) =>
            `    - ${p.name} (${p.type}): ${p.description}. Default: "${p.default}"`
        )
        .join("\n");

      return `
**${comp.name}** (ID: ${comp.id})
- ${comp.description}
- Duration: ${comp.durationInFrames / comp.fps} seconds
- Properties:
${propsList}`;
    })
    .join("\n");

  return `You are a helpful video creation assistant. You help users create professional videos using pre-built templates.

## Available Video Templates
${compositionDescriptions}

## Your Role
1. Understand what kind of video the user wants to create
2. Recommend the most suitable template
3. Help them customize the properties (colors, text, etc.)
4. When ready, generate the video configuration

## Guidelines
- Be conversational and helpful
- Ask clarifying questions if needed
- Suggest appropriate colors and text based on the user's needs
- When the user is ready to generate a video, respond with a JSON configuration block

## Video Generation Format
When the user confirms they want to generate a video, include this JSON block in your response:

\`\`\`video
{
  "composition": "CompositionId",
  "title": "A descriptive title for the video",
  "props": {
    "propName": "value"
  }
}
\`\`\`

Example:
\`\`\`video
{
  "composition": "HelloWorld",
  "title": "Welcome to Our Company",
  "props": {
    "titleText": "Welcome to Acme Corp",
    "titleColor": "#1a1a1a",
    "logoColor1": "#3b82f6",
    "logoColor2": "#8b5cf6"
  }
}
\`\`\`

Be creative and helpful! Guide users to create amazing videos.`;
}
