import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

const COLORS = {
  saffron: "#F4A460",
  gold: "#FFD700",
  deepRed: "#8B0000",
  cream: "#FFFACD",
  darkBrown: "#3E2723",
};

export const VerseScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = spring({
    frame,
    fps,
    config: { damping: 20 },
  });

  const verseOpacity = spring({
    frame: frame - 20,
    fps,
    config: { damping: 15 },
  });

  const translationOpacity = spring({
    frame: frame - 60,
    fps,
    config: { damping: 15 },
  });

  const glowPulse = Math.sin(frame * 0.05) * 0.3 + 0.7;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, #1a0a2e 0%, #2d1b4e 50%, #1a0a2e 100%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Glowing orb background */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.gold}20 0%, transparent 70%)`,
          opacity: glowPulse,
          filter: "blur(60px)",
        }}
      />

      {/* Title Badge */}
      <div
        style={{
          opacity: titleOpacity,
          marginBottom: 40,
          padding: "15px 50px",
          background: `linear-gradient(90deg, transparent, ${COLORS.gold}30, transparent)`,
          borderRadius: 50,
        }}
      >
        <p
          style={{
            fontSize: 28,
            fontFamily: "Arial, sans-serif",
            color: COLORS.gold,
            margin: 0,
            letterSpacing: 6,
            textTransform: "uppercase",
          }}
        >
          Verse of the Month
        </p>
      </div>

      {/* Verse Reference */}
      <div
        style={{
          opacity: verseOpacity,
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: 72,
            fontFamily: "Georgia, serif",
            color: "#FFFFFF",
            margin: 0,
            textShadow: `0 0 40px ${COLORS.gold}80`,
          }}
        >
          SB 7.1.30
        </h2>

        {/* Sanskrit transliteration */}
        <div
          style={{
            marginTop: 40,
            padding: "30px 60px",
            background: "rgba(255, 255, 255, 0.05)",
            borderRadius: 16,
            borderLeft: `4px solid ${COLORS.gold}`,
            borderRight: `4px solid ${COLORS.gold}`,
          }}
        >
          <p
            style={{
              fontSize: 32,
              fontFamily: "Georgia, serif",
              color: COLORS.saffron,
              margin: 0,
              fontStyle: "italic",
              lineHeight: 1.8,
            }}
          >
            kamad dvesad bhayat snehad
            <br />
            yatha bhaktyesvare manah
            <br />
            avesya tad-agham hitva
            <br />
            bahavas tad-gatim gatah
          </p>
        </div>
      </div>

      {/* Translation */}
      <div
        style={{
          opacity: translationOpacity,
          marginTop: 50,
          maxWidth: 1400,
          textAlign: "center",
        }}
      >
        <h3
          style={{
            fontSize: 42,
            fontFamily: "Georgia, serif",
            color: COLORS.gold,
            margin: 0,
            marginBottom: 20,
          }}
        >
          Attentive Thinking of Krishna Gives Liberation
        </h3>
        <p
          style={{
            fontSize: 28,
            fontFamily: "Georgia, serif",
            color: "#FFFFFF",
            margin: 0,
            lineHeight: 1.6,
            opacity: 0.9,
          }}
        >
          Many persons have attained liberation simply by thinking of Krishna
          with great attention—whether due to desire, fear, affection, or devotional service.
        </p>
      </div>
    </AbsoluteFill>
  );
};
