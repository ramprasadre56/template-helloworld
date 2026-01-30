import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

const COLORS = {
  saffron: "#F4A460",
  gold: "#FFD700",
  deepRed: "#8B0000",
  cream: "#FFFACD",
  darkBrown: "#3E2723",
};

export const ClosingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoOpacity = spring({
    frame,
    fps,
    config: { damping: 20 },
  });

  const logoScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const ctaOpacity = spring({
    frame: frame - 30,
    fps,
    config: { damping: 15 },
  });

  const ctaY = interpolate(
    spring({ frame: frame - 30, fps, config: { damping: 15 } }),
    [0, 1],
    [30, 0]
  );

  const buttonPulse = Math.sin(frame * 0.08) * 5;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${COLORS.deepRed} 0%, #5c1a1a 50%, ${COLORS.deepRed} 100%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Decorative rays */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: 4,
            height: 800,
            background: `linear-gradient(180deg, ${COLORS.gold}40, transparent)`,
            transform: `translate(-50%, -50%) rotate(${i * 30}deg)`,
            opacity: logoOpacity * 0.3,
          }}
        />
      ))}

      {/* Main content */}
      <div
        style={{
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
          textAlign: "center",
          zIndex: 1,
        }}
      >
        {/* Logo/Title */}
        <div
          style={{
            marginBottom: 30,
          }}
        >
          <h1
            style={{
              fontSize: 80,
              fontFamily: "Georgia, serif",
              color: COLORS.gold,
              margin: 0,
              textShadow: `0 4px 30px ${COLORS.gold}60`,
              letterSpacing: 4,
            }}
          >
            BHAGAVATA PRADIPIKA
          </h1>
          <p
            style={{
              fontSize: 28,
              fontFamily: "Georgia, serif",
              color: COLORS.cream,
              margin: 0,
              marginTop: 15,
              fontStyle: "italic",
            }}
          >
            Bask in the Illumination of the Bhagavatam
          </p>
        </div>

        {/* Divider */}
        <div
          style={{
            width: 400,
            height: 3,
            background: `linear-gradient(90deg, transparent, ${COLORS.gold}, transparent)`,
            margin: "30px auto",
          }}
        />

        {/* Publisher */}
        <p
          style={{
            fontSize: 24,
            fontFamily: "Arial, sans-serif",
            color: COLORS.saffron,
            margin: 0,
            letterSpacing: 2,
          }}
        >
          A Monthly E-Magazine from
        </p>
        <h2
          style={{
            fontSize: 42,
            fontFamily: "Georgia, serif",
            color: "#FFFFFF",
            margin: 0,
            marginTop: 10,
          }}
        >
          Bhaktivedanta Vidyapitha
        </h2>
      </div>

      {/* CTA */}
      <div
        style={{
          opacity: ctaOpacity,
          transform: `translateY(${ctaY}px)`,
          marginTop: 60,
          textAlign: "center",
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: "inline-block",
            padding: "20px 60px",
            background: COLORS.gold,
            borderRadius: 100,
            transform: `translateY(${buttonPulse}px)`,
            boxShadow: `0 10px 40px ${COLORS.gold}50`,
          }}
        >
          <p
            style={{
              fontSize: 28,
              fontFamily: "Arial, sans-serif",
              color: COLORS.darkBrown,
              margin: 0,
              fontWeight: 700,
            }}
          >
            Subscribe Now - Free Monthly Issues
          </p>
        </div>

        <p
          style={{
            fontSize: 22,
            fontFamily: "Arial, sans-serif",
            color: "rgba(255, 255, 255, 0.8)",
            margin: 0,
            marginTop: 30,
          }}
        >
          Dedicated to His Divine Grace A.C. Bhaktivedanta Swami Prabhupada
        </p>
        <p
          style={{
            fontSize: 18,
            fontFamily: "Arial, sans-serif",
            color: "rgba(255, 255, 255, 0.6)",
            margin: 0,
            marginTop: 10,
          }}
        >
          Founder-Acharya of ISKCON
        </p>
      </div>
    </AbsoluteFill>
  );
};
