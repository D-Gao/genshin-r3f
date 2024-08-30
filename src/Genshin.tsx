import GenshinExperience from "./Experience";
import { Canvas } from "@react-three/fiber";
import {
  Bloom,
  EffectComposer,
  ToneMapping,
} from "@react-three/postprocessing";
import { BlendFunction, Resolution, ToneMappingMode } from "postprocessing";
import * as THREE from "three";
import Overlay from "./Overlay";
import BloomTransition from "./effects/BloomTransition";
import { Suspense, useRef } from "react";

const Genshin = () => {
  const ref = useRef<HTMLCanvasElement>(null);

  return (
    <>
      <Canvas
        ref={ref}
        className="genshin-main"
        gl={{
          antialias: false,
          powerPreference: "default",
          logarithmicDepthBuffer: true,
        }}
        dpr={[1, 2]}
        onCreated={({ gl }) => {
          // 禁用颜色管理
          THREE.ColorManagement.enabled = false;
          // 设置输出颜色空间
          gl.outputColorSpace = THREE.LinearSRGBColorSpace;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
        }}
        shadows
        camera={{ far: 100000, position: [0, 10, 10], fov: 45 }}
      >
        <color attach="background" args={["#171720"]} />
        <fog attach="fog" args={[0x389af2, 5000, 10000]} />
        <Suspense fallback={null}>
          <GenshinExperience></GenshinExperience>
        </Suspense>
        {/*  default is set to 8 */}
        <EffectComposer multisampling={0}>
          <Bloom
            blendFunction={BlendFunction.ADD}
            mipmapBlur
            intensity={0.4}
            luminanceThreshold={2}
            resolutionX={Resolution.AUTO_SIZE} // The horizontal resolution.
            resolutionY={Resolution.AUTO_SIZE} // The vertical resolution.
          />
          <ToneMapping mode={ToneMappingMode.ACES_FILMIC}></ToneMapping>

          <BloomTransition intensity={0} whiteAlpha={0}></BloomTransition>
        </EffectComposer>
      </Canvas>
      <Overlay></Overlay>
    </>
  );
};
export default Genshin;
