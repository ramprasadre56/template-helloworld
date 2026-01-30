import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

const COLORS = {
  saffron: "#F4A460",
  gold: "#FFD700",
  deepRed: "#8B0000",
  cream: "#FFFACD",
  darkBrown: "#3E2723",
};

const analogies = [
  {
    reference: "SB 7.2.21",
    title: "The Restaurant Analogy",
    text: "In a restaurant, many travelers are brought together, and after drinking water they continue to their respective destinations. Similarly, living entities join together in a family, and later, as a result of their own actions, they are led apart to their destinations.",
    icon: "🏠",
  },
  {
    reference: "SB 7.2.48",
    title: "The Dream Analogy",
    text: "When the mind wanders and a man thinks himself extremely important, or when he dreams at night—these are merely false dreams. Similarly, the happiness and distress caused by the material senses should be understood to be meaningless.",
    icon: "💭",
  },
];

const AnalogyCard: React.FC<{
  analogy: typeof analogies[0];
  index: number;
  frame: number;
  fps: number;
}> = ({ analogy, index, frame, fps }) => {
  const delay = index * 60;
  const progress = spring({
    frame: frame - delay - 20,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  const scale = interpolate(progress, [0, 1], [0.9, 1]);
  const opacity = progress;
  const x = interpolate(progress, [0, 1], [index === 0 ? -100 : 100, 0]);

  return (
    <div
      style={{
        position: "absolute",
        left: index === 0 ? 80 : 980,
        top: 280,
        width: 840,
        transform: `scale(${scale}) translateX(${x}px)`,
        opacity,
      }}
    >
      <div
        style={{
          background: "rgba(255, 255, 255, 0.95)",
          borderRadius: 24,
          padding: 40,
          boxShadow: "0 15px 50px rgba(0, 0, 0, 0.2)",
          height: 500,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Icon and Reference */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              fontSize: 60,
              lineHeight: 1,
            }}
          >
            {analogy.icon}
          </div>
          <div>
            <p
              style={{
                fontSize: 22,
                fontFamily: "Arial, sans-serif",
                color: COLORS.deepRed,
                margin: 0,
                fontWeight: 700,
              }}
            >
              {analogy.reference}
            </p>
            <h3
              style={{
                fontSize: 32,
                fontFamily: "Georgia, serif",
                color: COLORS.darkBrown,
                margin: 0,
                marginTop: 5,
              }}
            >
              {analogy.title}
            </h3>
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            width: "100%",
            height: 3,
            background: `linear-gradient(90deg, ${COLORS.gold}, ${COLORS.saffron}, ${COLORS.gold})`,
            marginBottom: 25,
            borderRadius: 2,
          }}
        />

        {/* Text */}
        <p
          style={{
            fontSize: 26,
            fontFamily: "Georgia, serif",
            color: COLORS.darkBrown,
            margin: 0,
            lineHeight: 1.7,
            flex: 1,
          }}
        >
          {analogy.text}
        </p>
      </div>
    </div>
  );
};

export const AnalogyScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = spring({
    frame,
    fps,
    config: { damping: 20 },
  });

  const titleY = interpolate(
    spring({ frame, fps, config: { damping: 15 } }),
    [0, 1],
    [-30, 0]
  );

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
        overflow: "hidden",
      }}
    >
      {/* Background decoration */}
      <div
        style={{
          position: "absolute",
          top: -200,
          right: -200,
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.1)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -150,
          left: -150,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.08)",
        }}
      />

      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}
      >
        <h2
          style={{
            fontSize: 72,
            fontFamily: "Georgia, serif",
            color: "#FFFFFF",
            margin: 0,
            textShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
          }}
        >
          Analogy Arena
        </h2>
        <p
          style={{
            fontSize: 28,
            fontFamily: "Arial, sans-serif",
            color: "rgba(255, 255, 255, 0.9)",
            margin: 0,
            marginTop: 15,
          }}
        >
          Wisdom through Vivid Comparisons
        </p>
      </div>

      {/* Analogy Cards */}
      {analogies.map((analogy, index) => (
        <AnalogyCard
          key={index}
          analogy={analogy}
          index={index}
          frame={frame}
          fps={fps}
        />
      ))}
    </AbsoluteFill>
  );
};
