import React, { Suspense, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Physics, RigidBody, CuboidCollider } from "@react-three/rapier";
import {
  PointerLockControls as PointerLockControlsDesktop,
  Environment,
} from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useControls } from "leva";
import { useGame } from "./stores/useGame.js";
import { Perf } from "r3f-perf";
import { PointerLockControls as PointerLockControlsImpl } from "./hooks/PointerLockControls.js";
import MobileControls from "./components/MobileControls.jsx";
import Player from "./components/Player.jsx";
import Lights from "./components/Lights.jsx";
import * as THREE from "three";
import Water from "./components/Water.jsx";
import Geom3 from "./components/Scene.jsx";
import { LoadingScreen } from "./LoadingScreen.jsx";
import Colliders from "./components/Colliders.jsx";

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
  const overlayVisible = useGame((state) => state.overlayVisible);
  const setOverlayVisible = useGame((state) => state.setOverlayVisible);

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

  useEffect(() => {
    const handlePointerLockChange = () => {
      if (document.pointerLockElement !== null) {
        setOverlayVisible(true);
      } else {
        setOverlayVisible(false);
      }
    };

    document.addEventListener("pointerlockchange", handlePointerLockChange);

    return () => {
      document.removeEventListener(
        "pointerlockchange",
        handlePointerLockChange
      );
    };
  }, [setOverlayVisible]);

  return (
    <Suspense>
      <Canvas
        shadows
        camera={{
          fov: 45,
          near: 0.1,
          far: 1000,
        }}
      >
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
      </Canvas>
      {deviceType === 1 ? <MobileControls /> : <></>}
      <LoadingScreen
        started={overlayVisible}
        onStarted={() => setOverlayVisible(true)}
      />
    </Suspense>
  );
}
