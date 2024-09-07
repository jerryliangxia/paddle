import React, { useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Physics, RigidBody, CuboidCollider } from "@react-three/rapier";
import {
  PointerLockControls as PointerLockControlsDesktop,
  Sky,
} from "@react-three/drei";
import { useGame } from "./stores/useGame.js";
import { Perf } from "r3f-perf";
import { PointerLockControls as PointerLockControlsImpl } from "./hooks/PointerLockControls.js";
import MobileControls from "./components/MobileControls.jsx";
import Player from "./components/Player.jsx";
import Lights from "./Lights.jsx";
// import SphereSky from "./components/shader/SphereSky.jsx";
import * as THREE from "three";
import Water from "./components/Water.jsx";
import Scene from "./components/Scene.jsx";
import { useControls } from "leva";

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

  // const {
  //   turbidity,
  //   rayleigh,
  //   mieCoefficient,
  //   mieDirectionalG,
  //   inclination,
  //   azimuth,
  // } = useControls("Sky", {
  //   turbidity: { value: 10, min: 0, max: 20, step: 0.1 },
  //   rayleigh: { value: 2, min: 0, max: 4, step: 0.1 },
  //   mieCoefficient: { value: 0.005, min: 0, max: 0.1, step: 0.001 },
  //   mieDirectionalG: { value: 0.8, min: 0, max: 1, step: 0.01 },
  //   inclination: { value: 0.49, min: 0, max: 1, step: 0.01 }, // elevation / inclination
  //   azimuth: { value: -0.25, min: -1, max: 1, step: 0.01 }, // Facing front,
  // });

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
        {/* <SphereSky /> */}
        <Sky
          turbidity={0.9}
          rayleigh={1.3}
          mieCoefficient={0.3}
          mieDirectionalG={0.96}
          inclination={0.496}
          azimuth={-0.1}
        />
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
