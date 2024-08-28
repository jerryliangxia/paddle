import { PointerLockControls, Sky } from "@react-three/drei";
import * as THREE from "three";
import { Physics, RigidBody } from "@react-three/rapier";
import Lights from "./Lights.jsx";
import Player from "./components/Player.jsx";
import { Perf } from "r3f-perf";
import Ocean from "./components/Ocean.jsx";

export default function Experience() {
  return (
    <>
      <Perf />
      <Ocean />
      <Sky />
      <Physics>
        <PointerLockControls />
        <Lights />
        <RigidBody type="fixed" friction={0}>
          <mesh geometry={new THREE.BoxGeometry(100, 0.1, 100)}>
            <meshStandardMaterial opacity={0} transparent />
          </mesh>
        </RigidBody>
        <Player />
      </Physics>
    </>
  );
}
