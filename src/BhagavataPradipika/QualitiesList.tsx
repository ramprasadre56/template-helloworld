import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

const COLORS = {
  saffron: "#F4A460",
  gold: "#FFD700",
  deepRed: "#8B0000",
  cream: "#FFFACD",
  darkBrown: "#3E2723",
};

const qualities = [
  "Kind to everyone",
  "Makes no enemies",
  "Truthful",
  "Equal to everyone",
  "Faultless",
  "Magnanimous",
  "Mild",
  "Always clean",
  "Without possessions",
  "Works for everyone's benefit",
  "Very peaceful",
  "Surrendered to Krishna",
  "No material desires",
  "Very meek",
  "Steady",
  "Controls senses",
  "Does not overeat",
  "Not influenced by maya",
  "Offers respect to all",
  "Desires no respect",
  "Very grave",
  "Merciful",
  "Friendly",
  "Poetic",
  "Expert",
  "Silent",
];

const QualityItem: React.FC<{ quality: string; index: number; frame: number; fps: number }> = ({
  quality,
  index,
  frame,
  fps,
}) => {
  const delay = index * 3;
  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const x = interpolate(progress, [0, 1], [-50, 0]);
  const opacity = progress;

  const row = Math.floor(index / 2);
  const col = index % 2;

  return (
    <div
      style={{
        position: "absolute",
        left: col === 0 ? 100 : 1000,
        top: 180 + row * 65,
        transform: `translateX(${x}px)`,
        opacity,
        display: "flex",
        alignItems: "center",
        gap: 16,
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.saffron})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          fontWeight: 700,
          color: COLORS.darkBrown,
          boxShadow: `0 4px 12px ${COLORS.saffron}60`,
        }}
      >
        {index + 1}
      </div>
      <span
        style={{
          fontSize: 28,
          fontFamily: "Georgia, serif",
          color: COLORS.darkBrown,
          fontWeight: 500,
        }}
      >
        {quality}
      </span>
    </div>
  );
};

export const QualitiesList: React.FC = () => {
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
        background: `linear-gradient(180deg, ${COLORS.cream} 0%, #FFF8DC 100%)`,
        overflow: "hidden",
      }}
    >
      {/* Decorative elements */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 10,
          background: `linear-gradient(90deg, ${COLORS.deepRed}, ${COLORS.gold}, ${COLORS.deepRed})`,
        }}
      />

      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}
      >
        <h2
          style={{
            fontSize: 56,
            fontFamily: "Georgia, serif",
            color: COLORS.deepRed,
            margin: 0,
            textShadow: `2px 2px 4px ${COLORS.saffron}60`,
          }}
        >
          The 26 Vaishnava Qualities
        </h2>
        <p
          style={{
            fontSize: 24,
            fontFamily: "Arial, sans-serif",
            color: COLORS.darkBrown,
            margin: 0,
            marginTop: 10,
            fontStyle: "italic",
          }}
        >
          As described in Sri Caitanya-caritamrita
        </p>
      </div>

      {/* Qualities Grid */}
      {qualities.map((quality, index) => (
        <QualityItem
          key={index}
          quality={quality}
          index={index}
          frame={frame}
          fps={fps}
        />
      ))}

      {/* Bottom decoration */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 10,
          background: `linear-gradient(90deg, ${COLORS.deepRed}, ${COLORS.gold}, ${COLORS.deepRed})`,
        }}
      />
    </AbsoluteFill>
  );
};
