import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { z } from "zod";
import { zColor } from "@remotion/zod-types";
import { TitleScene } from "./BhagavataPradipika/TitleScene";
import { FounderMessage } from "./BhagavataPradipika/FounderMessage";
import { QualitiesList } from "./BhagavataPradipika/QualitiesList";
import { Personalities } from "./BhagavataPradipika/Personalities";
import { VerseScene } from "./BhagavataPradipika/VerseScene";
import { AnalogyScene } from "./BhagavataPradipika/AnalogyScene";
import { ClosingScene } from "./BhagavataPradipika/ClosingScene";

export const bhagavataPradipikaSchema = z.object({
  primaryColor: zColor(),
  accentColor: zColor(),
});

// Scene durations in frames (at 30fps)
const SCENE_DURATIONS = {
  title: 150,        // 5 seconds
  founder: 300,      // 10 seconds
  qualities: 900,    // 30 seconds
  personalities: 600, // 20 seconds
  verse: 300,        // 10 seconds
  analogy: 300,      // 10 seconds
  closing: 150,      // 5 seconds
};

// Calculate start frames
const SCENE_STARTS = {
  title: 0,
  founder: SCENE_DURATIONS.title,
  qualities: SCENE_DURATIONS.title + SCENE_DURATIONS.founder,
  personalities: SCENE_DURATIONS.title + SCENE_DURATIONS.founder + SCENE_DURATIONS.qualities,
  verse: SCENE_DURATIONS.title + SCENE_DURATIONS.founder + SCENE_DURATIONS.qualities + SCENE_DURATIONS.personalities,
  analogy: SCENE_DURATIONS.title + SCENE_DURATIONS.founder + SCENE_DURATIONS.qualities + SCENE_DURATIONS.personalities + SCENE_DURATIONS.verse,
  closing: SCENE_DURATIONS.title + SCENE_DURATIONS.founder + SCENE_DURATIONS.qualities + SCENE_DURATIONS.personalities + SCENE_DURATIONS.verse + SCENE_DURATIONS.analogy,
};

// Crossfade component for smooth transitions
const Crossfade: React.FC<{
  children: React.ReactNode;
  durationInFrames: number;
}> = ({ children, durationInFrames }) => {
  const frame = useCurrentFrame();

  // Fade in at start, fade out at end
  const fadeIn = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <AbsoluteFill style={{ opacity: Math.min(fadeIn, fadeOut) }}>
      {children}
    </AbsoluteFill>
  );
};

export const BhagavataPradipika: React.FC<z.infer<typeof bhagavataPradipikaSchema>> = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Final fade out
  const endFade = interpolate(
    frame,
    [durationInFrames - 30, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <AbsoluteFill style={{ opacity: endFade }}>
        {/* Scene 1: Title Intro */}
        <Sequence from={SCENE_STARTS.title} durationInFrames={SCENE_DURATIONS.title}>
          <Crossfade durationInFrames={SCENE_DURATIONS.title}>
            <TitleScene />
          </Crossfade>
        </Sequence>

        {/* Scene 2: Founder Acharya Message */}
        <Sequence from={SCENE_STARTS.founder} durationInFrames={SCENE_DURATIONS.founder}>
          <Crossfade durationInFrames={SCENE_DURATIONS.founder}>
            <FounderMessage />
          </Crossfade>
        </Sequence>

        {/* Scene 3: 26 Vaishnava Qualities */}
        <Sequence from={SCENE_STARTS.qualities} durationInFrames={SCENE_DURATIONS.qualities}>
          <Crossfade durationInFrames={SCENE_DURATIONS.qualities}>
            <QualitiesList />
          </Crossfade>
        </Sequence>

        {/* Scene 4: Exemplary Personalities */}
        <Sequence from={SCENE_STARTS.personalities} durationInFrames={SCENE_DURATIONS.personalities}>
          <Crossfade durationInFrames={SCENE_DURATIONS.personalities}>
            <Personalities />
          </Crossfade>
        </Sequence>

        {/* Scene 5: Verse of the Month */}
        <Sequence from={SCENE_STARTS.verse} durationInFrames={SCENE_DURATIONS.verse}>
          <Crossfade durationInFrames={SCENE_DURATIONS.verse}>
            <VerseScene />
          </Crossfade>
        </Sequence>

        {/* Scene 6: Analogy Arena */}
        <Sequence from={SCENE_STARTS.analogy} durationInFrames={SCENE_DURATIONS.analogy}>
          <Crossfade durationInFrames={SCENE_DURATIONS.analogy}>
            <AnalogyScene />
          </Crossfade>
        </Sequence>

        {/* Scene 7: Closing */}
        <Sequence from={SCENE_STARTS.closing} durationInFrames={SCENE_DURATIONS.closing}>
          <Crossfade durationInFrames={SCENE_DURATIONS.closing}>
            <ClosingScene />
          </Crossfade>
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
