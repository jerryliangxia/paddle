import React, { useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Physics, RigidBody, CuboidCollider } from "@react-three/rapier";
import {
  PointerLockControls as PointerLockControlsDesktop,
  Environment,
} from "@react-three/drei";
import { useGame } from "./stores/useGame.js";
import { Perf } from "r3f-perf";
import { PointerLockControls as PointerLockControlsImpl } from "./hooks/PointerLockControls.js";
import MobileControls from "./components/MobileControls.jsx";
import Player from "./components/Player.jsx";
import Lights from "./Lights.jsx";
import * as THREE from "three";
import Water from "./components/Water.jsx";
import Scene from "./components/Scene.jsx";

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
        <Environment background files="img/rustig_koppie_puresky_1k.hdr" />
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
        <Scene />
      </Canvas>
      {deviceType === 1 ? <MobileControls /> : <></>}
    </>
  );
}
