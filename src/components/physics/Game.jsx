import React from "react";
import { useThree } from "@react-three/fiber";
import { Physics, RigidBody, CuboidCollider } from "@react-three/rapier";
import {
  PointerLockControls as PointerLockControlsDesktop,
  Environment,
} from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useGame } from "../../stores/useGame.js";
import { PointerLockControls as PointerLockControlsImpl } from "../../hooks/PointerLockControls.js";
import Player from "./Player.jsx";
import Lights from "../Lights.jsx";
import Water from "../Water.jsx";
import Geom3 from "../Scene.jsx";
import Colliders from "./Colliders.jsx";

function PointerLockControlsMobile() {
  const { camera, gl } = useThree();
  const controls = React.useRef();

  React.useEffect(() => {
    controls.current = new PointerLockControlsImpl(camera, gl.domElement);
  }, [camera, gl.domElement]);

  return null;
}

// Physics Game
export default function Game() {
  const deviceType = useGame((state) => state.deviceType);

  return (
    <>
      <fog attach="fog" color="#1d2b0f" near={1} far={800} />
      <Environment background files="img/rustig_koppie_puresky_1k.hdr" />
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
      <Physics>
        {deviceType === 0 ? (
          <PointerLockControlsDesktop />
        ) : (
          <PointerLockControlsMobile />
        )}
        <Lights />
        <RigidBody type="fixed" friction={0}>
          <CuboidCollider args={[1000, 0.1, 1000]} />
        </RigidBody>
        <Player />
        <Colliders />
      </Physics>
      <Water />
      <Geom3 />
    </>
  );
}
