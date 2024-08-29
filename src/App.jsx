import React, { useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { PointerLockControls as PointerLockControlsDesktop } from "@react-three/drei";
import { PointerLockControls as PointerLockControlsImpl } from "./hooks/PointerLockControls.js";
import { Physics, RigidBody } from "@react-three/rapier";
import Lights from "./Lights.jsx";
import Player from "./components/Player.jsx";
import { Perf } from "r3f-perf";
import Ocean from "./components/Ocean.jsx";
import SphereSky from "./components/shader/SphereSky.jsx";
import { useGame } from "./stores/useGame.js";
import MobileControls from "./components/MobileControls.jsx";
import * as THREE from "three";

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
        <Ocean />
        <SphereSky />
        <mesh
          geometry={new THREE.BoxGeometry(20, 100, 20)}
          position={[10, 0, 10]}
        >
          <meshStandardMaterial color="red" />
        </mesh>
        <Physics>
          {deviceType === 0 ? (
            <PointerLockControlsDesktop />
          ) : (
            <PointerLockControlsMobile />
          )}
          <Lights />
          <RigidBody type="fixed" friction={0}>
            <mesh geometry={new THREE.BoxGeometry(400, 0.1, 400)}>
              <meshStandardMaterial opacity={0} transparent />
            </mesh>
          </RigidBody>
          <Player />
        </Physics>
      </Canvas>
      {deviceType === 1 ? <MobileControls /> : <></>}
    </>
  );
}
