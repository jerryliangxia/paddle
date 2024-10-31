import React from "react";
import { useThree } from "@react-three/fiber";
import {
  PointerLockControls as PointerLockControlsDesktop,
  Environment,
} from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useGame } from "./stores/useGame.js";
import { PointerLockControls as PointerLockControlsImpl } from "./hooks/PointerLockControls.js";
import Player from "./hooks/Player.jsx";
import Lights from "./components/Lights.jsx";
import Water from "./components/Water.jsx";
import Geom3 from "./components/Scene.jsx";
import useOctree from "./hooks/useOctree";
import useOctreeHelper from "./hooks/useOctreeHelper";
import { useGLTF } from "@react-three/drei";

function PointerLockControlsMobile() {
  const { camera, gl } = useThree();
  const controls = React.useRef();

  React.useEffect(() => {
    controls.current = new PointerLockControlsImpl(camera, gl.domElement);
  }, [camera, gl.domElement]);

  return null;
}

export default function App() {
  const deviceType = useGame((state) => state.deviceType);
  const { scene } = useGLTF("/geom3_borders1.glb");
  const octree = useOctree(scene);
  //   useOctreeHelper(octree);

  return (
    <>
      <fog attach="fog" color="#1d2b0f" near={1} far={800} />
      {/* <Perf /> */}
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
      {/* <Physics> */}
      {deviceType === 0 ? (
        <PointerLockControlsDesktop />
      ) : (
        <PointerLockControlsMobile />
      )}
      <Lights />
      {/* <RigidBody type="fixed" friction={0}>
        <CuboidCollider args={[1000, 0.1, 1000]} />
      </RigidBody> */}
      {/* <Player /> */}
      <Player octree={octree} />
      {/* <Colliders /> */}
      {/* </Physics> */}
      {/* <Water /> */}
      <Geom3 />
    </>
  );
}
