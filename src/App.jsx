import React, { useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Physics, RigidBody, CuboidCollider } from "@react-three/rapier";
import { PointerLockControls as PointerLockControlsDesktop } from "@react-three/drei";
import { useGame } from "./stores/useGame.js";
import { Perf } from "r3f-perf";
import { PointerLockControls as PointerLockControlsImpl } from "./hooks/PointerLockControls.js";
import MobileControls from "./components/MobileControls.jsx";
import Player from "./components/Player.jsx";
import Lights from "./Lights.jsx";
import SphereSky from "./components/shader/SphereSky.jsx";
import * as THREE from "three";
import Water from "./components/Water.jsx";

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
  const setDeviceType = useGame((state) => state.setDeviceType);
  const width = 100;
  const depth = 100;
  const heights = new Float32Array(width * depth).fill(0);

  useEffect(() => {
    if ("ontouchstart" in window || navigator.maxTouchPoints > 0) {
      setDeviceType(1);
    } else {
      setDeviceType(0);
    }
  }, []);

  useEffect(() => {
    const preventDefaultTouch = (e) => {
      e.preventDefault();
    };

    document.body.addEventListener("touchstart", preventDefaultTouch, {
      passive: false,
    });

    return () => {
      document.body.removeEventListener("touchstart", preventDefaultTouch);
    };
  }, []);

  return (
    <>
      <Canvas
        shadows
        camera={{
          fov: 45,
          near: 0.1,
          far: 200,
        }}
      >
        {/* <Perf /> */}
        <SphereSky />
        <Physics>
          {deviceType === 0 ? (
            <PointerLockControlsDesktop />
          ) : (
            <PointerLockControlsMobile />
          )}
          <Lights />
          <RigidBody type="fixed" friction={0}>
            <CuboidCollider args={[100, 0.1, 100]} />
          </RigidBody>
          <Player />
        </Physics>
        <Water />

        <mesh position={[-2, 0, -2]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="red" />
        </mesh>

        <mesh position={[2, 0, -2]}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial color="blue" />
        </mesh>
      </Canvas>
      {deviceType === 1 ? <MobileControls /> : <></>}
    </>
  );
}
