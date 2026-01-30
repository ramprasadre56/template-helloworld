import { Composition } from "remotion";
import { HelloWorld, myCompSchema } from "./HelloWorld";
import { Logo, myCompSchema2 } from "./HelloWorld/Logo";
import { BookedInDemo, bookedInSchema } from "./BookedInDemo";
import { BhagavataPradipika, bhagavataPradipikaSchema } from "./BhagavataPradipika";

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        // You can take the "id" to render a video:
        // npx remotion render HelloWorld
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        // You can override these props for each render:
        // https://www.remotion.dev/docs/parametrized-rendering
        schema={myCompSchema}
        defaultProps={{
          titleText: "Welcome to Remotion",
          titleColor: "#000000",
          logoColor1: "#91EAE4",
          logoColor2: "#86A8E7",
        }}
      />

      {/* Mount any React component to make it show up in the sidebar and work on it individually! */}
      <Composition
        id="OnlyLogo"
        component={Logo}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        schema={myCompSchema2}
        defaultProps={{
          logoColor1: "#91dAE2" as const,
          logoColor2: "#86A8E7" as const,
        }}
      />

      {/* BookedIn.ai Product Demo */}
      <Composition
        id="BookedInDemo"
        component={BookedInDemo}
        durationInFrames={570}
        fps={30}
        width={1920}
        height={1080}
        schema={bookedInSchema}
        defaultProps={{
          accentColor: "#2563EB",
        }}
      />

      {/* Bhagavata Pradipika - January 2026 */}
      <Composition
        id="BhagavataPradipika"
        component={BhagavataPradipika}
        durationInFrames={2700}
        fps={30}
        width={1920}
        height={1080}
        schema={bhagavataPradipikaSchema}
        defaultProps={{
          primaryColor: "#F4A460",
          accentColor: "#8B0000",
        }}
      />
    </>
  );
};
