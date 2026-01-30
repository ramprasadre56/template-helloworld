import { spring } from "remotion";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { z } from "zod";
import { zColor } from "@remotion/zod-types";

// Color scheme
const COLORS = {
  background: "#FFFFFF",
  text: "#000000",
  accent: "#2563EB", // Blue accent
  accentLight: "#3B82F6",
  accentDark: "#1D4ED8",
  gray: "#6B7280",
  lightGray: "#F3F4F6",
};

export const bookedInSchema = z.object({
  accentColor: zColor(),
});

// Animated Logo Component
const AnimatedLogo: React.FC<{ color: string }> = ({ color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const rotation = interpolate(frame, [0, 30], [0, 360], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: `scale(${scale})`,
      }}
    >
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: 20,
          background: `linear-gradient(135deg, ${color} 0%, ${COLORS.accentDark} 100%)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginRight: 24,
          transform: `rotate(${rotation}deg)`,
          boxShadow: "0 20px 60px rgba(37, 99, 235, 0.3)",
        }}
      >
        <svg width="48" height="48" viewBox="0 0 24 24" fill="white">
          <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />
        </svg>
      </div>
      <span
        style={{
          fontSize: 72,
          fontWeight: 800,
          color: COLORS.text,
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        BookedIn
        <span style={{ color }}>.</span>
        <span style={{ color }}>ai</span>
      </span>
    </div>
  );
};

// Intro Scene
const IntroScene: React.FC<{ accentColor: string }> = ({ accentColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = spring({
    frame: frame - 10,
    fps,
    config: { damping: 20 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.background,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: fadeIn,
      }}
    >
      <AnimatedLogo color={accentColor} />
    </AbsoluteFill>
  );
};

// Tagline Scene
const TaglineScene: React.FC<{ accentColor: string }> = ({ accentColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  const subtitleSpring = spring({
    frame: frame - 15,
    fps,
    config: { damping: 15 },
  });

  const titleY = interpolate(titleSpring, [0, 1], [100, 0]);
  const subtitleY = interpolate(subtitleSpring, [0, 1], [50, 0]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.background,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 80,
      }}
    >
      <h1
        style={{
          fontSize: 96,
          fontWeight: 800,
          color: COLORS.text,
          fontFamily: "Inter, system-ui, sans-serif",
          margin: 0,
          textAlign: "center",
          transform: `translateY(${titleY}px)`,
          opacity: titleSpring,
        }}
      >
        Never Chase Leads{" "}
        <span style={{ color: accentColor }}>Again</span>
      </h1>
      <p
        style={{
          fontSize: 32,
          color: COLORS.gray,
          fontFamily: "Inter, system-ui, sans-serif",
          marginTop: 40,
          textAlign: "center",
          maxWidth: 1200,
          lineHeight: 1.5,
          transform: `translateY(${subtitleY}px)`,
          opacity: subtitleSpring,
        }}
      >
        No-code platform to launch AI agents that call, text, and email leads
        to automate follow-ups and book more sales calls.
      </p>
    </AbsoluteFill>
  );
};

// Feature Card Component
const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
  accentColor: string;
  index: number;
}> = ({ icon, title, description, delay, accentColor, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  const y = interpolate(progress, [0, 1], [80, 0]);
  const scale = interpolate(progress, [0, 1], [0.8, 1]);

  return (
    <div
      style={{
        width: 380,
        padding: 40,
        backgroundColor: COLORS.lightGray,
        borderRadius: 24,
        transform: `translateY(${y}px) scale(${scale})`,
        opacity: progress,
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08)",
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 16,
          backgroundColor: accentColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 24,
        }}
      >
        {icon}
      </div>
      <h3
        style={{
          fontSize: 28,
          fontWeight: 700,
          color: COLORS.text,
          fontFamily: "Inter, system-ui, sans-serif",
          margin: 0,
          marginBottom: 12,
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: 18,
          color: COLORS.gray,
          fontFamily: "Inter, system-ui, sans-serif",
          margin: 0,
          lineHeight: 1.6,
        }}
      >
        {description}
      </p>
    </div>
  );
};

// Features Scene
const FeaturesScene: React.FC<{ accentColor: string }> = ({ accentColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({
    frame,
    fps,
    config: { damping: 15 },
  });

  const features = [
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
          <path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57-.35-.11-.74-.03-1.02.24l-2.2 2.2c-2.83-1.44-5.15-3.75-6.59-6.59l2.2-2.21c.28-.26.36-.65.25-1C8.7 6.45 8.5 5.25 8.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1z" />
        </svg>
      ),
      title: "Voice & SMS",
      description: "AI agents that call and text your leads 24/7",
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
        </svg>
      ),
      title: "No-Code Builder",
      description: "Drag-and-drop visual workflow automation",
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
          <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm-4.5-7c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z" />
        </svg>
      ),
      title: "Auto Scheduling",
      description: "Real-time calendar integration & booking",
    },
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.background,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 80,
      }}
    >
      <h2
        style={{
          fontSize: 64,
          fontWeight: 800,
          color: COLORS.text,
          fontFamily: "Inter, system-ui, sans-serif",
          margin: 0,
          marginBottom: 60,
          opacity: titleProgress,
          transform: `translateY(${interpolate(titleProgress, [0, 1], [30, 0])}px)`,
        }}
      >
        Powerful <span style={{ color: accentColor }}>Features</span>
      </h2>
      <div
        style={{
          display: "flex",
          gap: 40,
          justifyContent: "center",
        }}
      >
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            delay={index * 8 + 10}
            accentColor={accentColor}
            index={index}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};

// Stats Scene
const StatsScene: React.FC<{ accentColor: string }> = ({ accentColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const stats = [
    { value: "700%", label: "Higher Conversion" },
    { value: "42x", label: "Faster Building" },
    { value: "2,000+", label: "Agents Built" },
    { value: "4.9/5", label: "User Rating" },
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.background,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 80,
      }}
    >
      <h2
        style={{
          fontSize: 64,
          fontWeight: 800,
          color: COLORS.text,
          fontFamily: "Inter, system-ui, sans-serif",
          margin: 0,
          marginBottom: 80,
        }}
      >
        Real <span style={{ color: accentColor }}>Results</span>
      </h2>
      <div
        style={{
          display: "flex",
          gap: 80,
          justifyContent: "center",
        }}
      >
        {stats.map((stat, index) => {
          const delay = index * 6;
          const progress = spring({
            frame: frame - delay,
            fps,
            config: { damping: 12, stiffness: 100 },
          });

          const countProgress = interpolate(
            frame - delay,
            [0, 30],
            [0, 1],
            { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
          );

          return (
            <div
              key={index}
              style={{
                textAlign: "center",
                transform: `scale(${progress})`,
                opacity: progress,
              }}
            >
              <div
                style={{
                  fontSize: 80,
                  fontWeight: 800,
                  color: accentColor,
                  fontFamily: "Inter, system-ui, sans-serif",
                  marginBottom: 16,
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: 24,
                  color: COLORS.gray,
                  fontFamily: "Inter, system-ui, sans-serif",
                  fontWeight: 500,
                }}
              >
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// Use Cases Scene
const UseCasesScene: React.FC<{ accentColor: string }> = ({ accentColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const useCases = [
    "AI Scheduler",
    "Sales Automation",
    "Lead Follow-up",
    "Unified Inbox",
  ];

  const titleProgress = spring({
    frame,
    fps,
    config: { damping: 15 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.background,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 80,
      }}
    >
      <h2
        style={{
          fontSize: 64,
          fontWeight: 800,
          color: COLORS.text,
          fontFamily: "Inter, system-ui, sans-serif",
          margin: 0,
          marginBottom: 60,
          opacity: titleProgress,
        }}
      >
        Built For <span style={{ color: accentColor }}>You</span>
      </h2>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 24,
          justifyContent: "center",
          maxWidth: 1200,
        }}
      >
        {useCases.map((useCase, index) => {
          const delay = index * 5 + 10;
          const progress = spring({
            frame: frame - delay,
            fps,
            config: { damping: 12 },
          });

          return (
            <div
              key={index}
              style={{
                padding: "24px 48px",
                backgroundColor: index % 2 === 0 ? accentColor : COLORS.lightGray,
                color: index % 2 === 0 ? "white" : COLORS.text,
                borderRadius: 100,
                fontSize: 28,
                fontWeight: 600,
                fontFamily: "Inter, system-ui, sans-serif",
                transform: `scale(${progress}) translateY(${interpolate(progress, [0, 1], [20, 0])}px)`,
                opacity: progress,
              }}
            >
              {useCase}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// CTA Scene
const CTAScene: React.FC<{ accentColor: string }> = ({ accentColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 80 },
  });

  const buttonPulse = Math.sin(frame * 0.1) * 3;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.background,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          transform: `scale(${progress})`,
          opacity: progress,
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: 80,
            fontWeight: 800,
            color: COLORS.text,
            fontFamily: "Inter, system-ui, sans-serif",
            margin: 0,
            marginBottom: 24,
          }}
        >
          Ready to <span style={{ color: accentColor }}>Automate</span>?
        </h2>
        <p
          style={{
            fontSize: 28,
            color: COLORS.gray,
            fontFamily: "Inter, system-ui, sans-serif",
            marginBottom: 48,
          }}
        >
          Start building your AI agents today
        </p>
        <div
          style={{
            display: "inline-block",
            padding: "24px 64px",
            backgroundColor: accentColor,
            borderRadius: 100,
            fontSize: 32,
            fontWeight: 700,
            color: "white",
            fontFamily: "Inter, system-ui, sans-serif",
            transform: `translateY(${buttonPulse}px)`,
            boxShadow: `0 20px 60px ${accentColor}66`,
          }}
        >
          Get Started Free →
        </div>
        <div
          style={{
            marginTop: 48,
            fontSize: 20,
            color: COLORS.gray,
            fontFamily: "Inter, system-ui, sans-serif",
          }}
        >
          bookedin.ai
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Main Composition
export const BookedInDemo: React.FC<z.infer<typeof bookedInSchema>> = ({
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Fade out at the end
  const endFade = interpolate(
    frame,
    [durationInFrames - 15, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      <AbsoluteFill style={{ opacity: endFade }}>
        {/* Scene 1: Logo Intro (0-60 frames = 2 seconds) */}
        <Sequence from={0} durationInFrames={60}>
          <IntroScene accentColor={accentColor} />
        </Sequence>

        {/* Scene 2: Tagline (60-150 frames = 3 seconds) */}
        <Sequence from={60} durationInFrames={90}>
          <TaglineScene accentColor={accentColor} />
        </Sequence>

        {/* Scene 3: Features (150-270 frames = 4 seconds) */}
        <Sequence from={150} durationInFrames={120}>
          <FeaturesScene accentColor={accentColor} />
        </Sequence>

        {/* Scene 4: Stats (270-390 frames = 4 seconds) */}
        <Sequence from={270} durationInFrames={120}>
          <StatsScene accentColor={accentColor} />
        </Sequence>

        {/* Scene 5: Use Cases (390-480 frames = 3 seconds) */}
        <Sequence from={390} durationInFrames={90}>
          <UseCasesScene accentColor={accentColor} />
        </Sequence>

        {/* Scene 6: CTA (480-570 frames = 3 seconds) */}
        <Sequence from={480} durationInFrames={90}>
          <CTAScene accentColor={accentColor} />
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
