import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

const COLORS = {
  saffron: "#F4A460",
  gold: "#FFD700",
  deepRed: "#8B0000",
  cream: "#FFFACD",
  darkBrown: "#3E2723",
  skyBlue: "#87CEEB",
};

export const FounderMessage: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = spring({
    frame,
    fps,
    config: { damping: 20 },
  });

  const quoteOpacity = spring({
    frame: frame - 30,
    fps,
    config: { damping: 15 },
  });

  const quoteY = interpolate(
    spring({ frame: frame - 30, fps, config: { damping: 15 } }),
    [0, 1],
    [50, 0]
  );

  // Animated clouds
  const cloudX1 = interpolate(frame, [0, 300], [-100, 200], {
    extrapolateRight: "clamp",
  });
  const cloudX2 = interpolate(frame, [0, 300], [1920, 1600], {
    extrapolateRight: "clamp",
  });

  // Lightning flash effect
  const lightningOpacity = frame > 100 && frame < 105 ? 0.3 : 0;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Animated clouds */}
      <div
        style={{
          position: "absolute",
          top: 100,
          left: cloudX1,
          width: 300,
          height: 100,
          borderRadius: "50%",
          background: "rgba(100, 100, 150, 0.4)",
          filter: "blur(30px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 150,
          left: cloudX2,
          width: 400,
          height: 120,
          borderRadius: "50%",
          background: "rgba(80, 80, 130, 0.3)",
          filter: "blur(40px)",
        }}
      />

      {/* Lightning flash */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: COLORS.gold,
          opacity: lightningOpacity,
        }}
      />

      {/* Title */}
      <div
        style={{
          opacity: titleOpacity,
          marginBottom: 40,
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: 28,
            fontFamily: "Arial, sans-serif",
            color: COLORS.gold,
            margin: 0,
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          From the Desk of the Founder Acharya
        </p>
        <h2
          style={{
            fontSize: 64,
            fontFamily: "Georgia, serif",
            color: "#FFFFFF",
            margin: 0,
            marginTop: 20,
            textShadow: `0 0 30px ${COLORS.skyBlue}`,
          }}
        >
          Clouds of Ignorance, Lightning of Hope
        </h2>
      </div>

      {/* Quote */}
      <div
        style={{
          opacity: quoteOpacity,
          transform: `translateY(${quoteY}px)`,
          maxWidth: 1400,
          padding: "40px 60px",
          background: "rgba(255, 255, 255, 0.05)",
          borderRadius: 20,
          borderLeft: `4px solid ${COLORS.gold}`,
        }}
      >
        <p
          style={{
            fontSize: 36,
            fontFamily: "Georgia, serif",
            color: "#FFFFFF",
            margin: 0,
            lineHeight: 1.6,
            fontStyle: "italic",
            textAlign: "center",
          }}
        >
          "The serene sky, limitlessly expansive, is compared to the Absolute Truth.
          The flash of lightning is the only beam of hope that can lead one to the
          path of knowledge."
        </p>
        <p
          style={{
            fontSize: 24,
            fontFamily: "Arial, sans-serif",
            color: COLORS.gold,
            margin: 0,
            marginTop: 30,
            textAlign: "right",
          }}
        >
          — A.C. Bhaktivedanta Swami Prabhupada
        </p>
        <p
          style={{
            fontSize: 20,
            fontFamily: "Arial, sans-serif",
            color: COLORS.saffron,
            margin: 0,
            marginTop: 10,
            textAlign: "right",
            fontStyle: "italic",
          }}
        >
          Light of Bhagavata
        </p>
      </div>
    </AbsoluteFill>
  );
};
