import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

const COLORS = {
  saffron: "#F4A460",
  gold: "#FFD700",
  deepRed: "#8B0000",
  cream: "#FFFACD",
  darkBrown: "#3E2723",
};

export const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const subtitleOpacity = spring({
    frame: frame - 20,
    fps,
    config: { damping: 20 },
  });

  const themeOpacity = spring({
    frame: frame - 40,
    fps,
    config: { damping: 20 },
  });

  const decorY = interpolate(frame, [0, 150], [0, -10], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${COLORS.cream} 0%, #FFF8DC 50%, ${COLORS.saffron}30 100%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Decorative top border */}
      <div
        style={{
          position: "absolute",
          top: 40,
          width: "80%",
          height: 8,
          background: `linear-gradient(90deg, transparent, ${COLORS.gold}, ${COLORS.saffron}, ${COLORS.gold}, transparent)`,
          transform: `translateY(${decorY}px)`,
          opacity: titleScale,
        }}
      />

      {/* Main Title */}
      <div
        style={{
          transform: `scale(${titleScale})`,
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: 120,
            fontWeight: 800,
            fontFamily: "Georgia, serif",
            color: COLORS.deepRed,
            margin: 0,
            textShadow: `3px 3px 6px ${COLORS.saffron}80`,
            letterSpacing: 4,
          }}
        >
          BHAGAVATA
        </h1>
        <h1
          style={{
            fontSize: 140,
            fontWeight: 800,
            fontFamily: "Georgia, serif",
            color: COLORS.saffron,
            margin: 0,
            marginTop: -20,
            textShadow: `3px 3px 6px ${COLORS.deepRed}40`,
            letterSpacing: 8,
          }}
        >
          PRADIPIKA
        </h1>
      </div>

      {/* Subtitle */}
      <div
        style={{
          opacity: subtitleOpacity,
          marginTop: 30,
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: 32,
            fontFamily: "Georgia, serif",
            color: COLORS.darkBrown,
            margin: 0,
            fontStyle: "italic",
          }}
        >
          Bask in the Illumination of the Bhagavatam
        </p>
        <p
          style={{
            fontSize: 28,
            fontFamily: "Arial, sans-serif",
            color: COLORS.deepRed,
            margin: 0,
            marginTop: 20,
            fontWeight: 600,
          }}
        >
          January 2026 | Issue 103
        </p>
      </div>

      {/* Theme */}
      <div
        style={{
          opacity: themeOpacity,
          marginTop: 50,
          padding: "20px 60px",
          background: `linear-gradient(90deg, transparent, ${COLORS.gold}40, transparent)`,
          borderRadius: 10,
        }}
      >
        <p
          style={{
            fontSize: 42,
            fontFamily: "Georgia, serif",
            color: COLORS.deepRed,
            margin: 0,
            fontWeight: 700,
            textAlign: "center",
          }}
        >
          Welcoming the 26 Vaishnava Qualities in 2026
        </p>
      </div>

      {/* Decorative bottom border */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          width: "80%",
          height: 8,
          background: `linear-gradient(90deg, transparent, ${COLORS.gold}, ${COLORS.saffron}, ${COLORS.gold}, transparent)`,
          transform: `translateY(${-decorY}px)`,
          opacity: titleScale,
        }}
      />
    </AbsoluteFill>
  );
};
