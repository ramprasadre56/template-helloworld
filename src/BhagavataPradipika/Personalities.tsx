import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

const COLORS = {
  saffron: "#F4A460",
  gold: "#FFD700",
  deepRed: "#8B0000",
  cream: "#FFFACD",
  darkBrown: "#3E2723",
};

const personalities = [
  {
    name: "Lord Shiva",
    quality: "Kindness & Tolerance",
    description: "Drank poison to save the universe. Remained silent when insulted by Daksha.",
    color: "#6B5B95",
  },
  {
    name: "Maharaja Ambarisa",
    quality: "Compassion & Surrender",
    description: "Remained calm against Durvasa's demon. Prayed to protect his attacker.",
    color: "#88B04B",
  },
  {
    name: "Prahlada Maharaja",
    quality: "Without Enmity",
    description: "Tolerated severe difficulties from his own father. Saw all as part of the Lord.",
    color: "#FF6F61",
  },
  {
    name: "King Rantideva",
    quality: "Mercy & Equality",
    description: "Served guests of all castes equally. Wished to suffer for others' freedom.",
    color: "#5B5EA6",
  },
];

const PersonalityCard: React.FC<{
  personality: typeof personalities[0];
  index: number;
  frame: number;
  fps: number;
}> = ({ personality, index, frame, fps }) => {
  const delay = index * 30;
  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  const scale = interpolate(progress, [0, 1], [0.8, 1]);
  const opacity = progress;
  const y = interpolate(progress, [0, 1], [50, 0]);

  const col = index % 2;
  const row = Math.floor(index / 2);

  return (
    <div
      style={{
        position: "absolute",
        left: col === 0 ? 100 : 1000,
        top: 200 + row * 380,
        width: 800,
        transform: `scale(${scale}) translateY(${y}px)`,
        opacity,
      }}
    >
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 24,
          padding: 40,
          boxShadow: `0 10px 40px rgba(0, 0, 0, 0.15)`,
          borderLeft: `8px solid ${personality.color}`,
        }}
      >
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
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${personality.color}, ${personality.color}99)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
              color: "#FFFFFF",
              fontWeight: 700,
              fontFamily: "Georgia, serif",
            }}
          >
            {personality.name.charAt(0)}
          </div>
          <div>
            <h3
              style={{
                fontSize: 36,
                fontFamily: "Georgia, serif",
                color: COLORS.darkBrown,
                margin: 0,
                fontWeight: 700,
              }}
            >
              {personality.name}
            </h3>
            <p
              style={{
                fontSize: 22,
                fontFamily: "Arial, sans-serif",
                color: personality.color,
                margin: 0,
                marginTop: 5,
                fontWeight: 600,
              }}
            >
              {personality.quality}
            </p>
          </div>
        </div>
        <p
          style={{
            fontSize: 24,
            fontFamily: "Georgia, serif",
            color: COLORS.darkBrown,
            margin: 0,
            lineHeight: 1.5,
            fontStyle: "italic",
          }}
        >
          {personality.description}
        </p>
      </div>
    </div>
  );
};

export const Personalities: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = spring({
    frame,
    fps,
    config: { damping: 20 },
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)`,
        overflow: "hidden",
      }}
    >
      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: titleOpacity,
        }}
      >
        <h2
          style={{
            fontSize: 56,
            fontFamily: "Georgia, serif",
            color: COLORS.deepRed,
            margin: 0,
          }}
        >
          Exemplary Personalities
        </h2>
        <p
          style={{
            fontSize: 24,
            fontFamily: "Arial, sans-serif",
            color: COLORS.darkBrown,
            margin: 0,
            marginTop: 10,
          }}
        >
          From Srimad Bhagavatam
        </p>
      </div>

      {/* Personality Cards */}
      {personalities.map((personality, index) => (
        <PersonalityCard
          key={index}
          personality={personality}
          index={index}
          frame={frame}
          fps={fps}
        />
      ))}
    </AbsoluteFill>
  );
};
