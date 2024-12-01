import React from "react";
import { useThree } from "@react-three/fiber";
import {
  PointerLockControls as PointerLockControlsDesktop,
  Environment,
  Sky,
} from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useGame } from "../stores/useGame.js";
import { PointerLockControls as PointerLockControlsImpl } from "../hooks/PointerLockControls.js";
import Lights from "./Lights.jsx";
import Water from "./Water.jsx";
import Scene from "./Scene.jsx";

function PointerLockControlsMobile() {
  const { camera, gl } = useThree();
  const controls = React.useRef();

  React.useEffect(() => {
    controls.current = new PointerLockControlsImpl(camera, gl.domElement);
  }, [camera, gl.domElement]);

  return null;
}

export default function GameObjects() {
  const deviceType = useGame((state) => state.deviceType);
  const map = useGame((state) => state.map);
  return (
    <>
      {deviceType === 0 ? (
        <PointerLockControlsDesktop />
      ) : (
        <PointerLockControlsMobile />
      )}
      <fog attach="fog" color="#1d2b0f" near={1} far={800} />
      <Environment background files="img/rustig_koppie_puresky_1k.hdr" />
      {/* <Sky /> */}
      <EffectComposer>
        <Bloom
          mipmapBlur={2}
          luminanceThreshold={1}
          luminanceSmoothing={100}
          intensity={0.2}
          radius={0.7}
          height={100}
        />
      </EffectComposer>
      <Lights />
      <Water />
      {map === 0 ? (
        <Scene file="/geom4.glb" />
      ) : (
        <Scene file="future_scene.glb" />
      )}
    </>
  );
}
