import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useGame } from "./stores/useGame.js";
import MobileControls from "./components/MobileControls.jsx";
import { LoadingScreen } from "./LoadingScreen.jsx";
import PhysicsGame from "./components/physics/Game.jsx";
import Game from "./components/octree/Game.jsx";
import GameObjects from "./components/GameObjects.jsx";
import { Perf } from "r3f-perf";

export default function App() {
  const deviceType = useGame((state) => state.deviceType);
  const setDeviceType = useGame((state) => state.setDeviceType);
  const overlayVisible = useGame((state) => state.overlayVisible);
  const setOverlayVisible = useGame((state) => state.setOverlayVisible);
  const setDesktopControl = useGame((state) => state.setDesktopControl);
  const isInSquare = useGame((state) => state.isInSquare);
  const player = useGame((state) => state.player);
  const map = useGame((state) => state.map);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    if (isInSquare) {
      setShowPrompt(true);
    } else {
      setShowPrompt(false);
    }
  }, [isInSquare]);

  useEffect(() => {
    if ("ontouchstart" in window || navigator.maxTouchPoints > 0) {
      setDesktopControl(false);
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

  const handlePause = () => {
    setOverlayVisible(false);
  };

  const useOctree = true;

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
        {/* <Perf /> */}
        {useOctree ? <Game /> : <PhysicsGame />}
        <GameObjects />
      </Canvas>
      {deviceType === 1 && overlayVisible && (
        <button
          className="pauseButton"
          style={{ zIndex: 0 }}
          onClick={handlePause}
          onTouchStart={handlePause}
        >
          ||
        </button>
      )}
      {deviceType === 1 ? <MobileControls /> : <></>}
      <LoadingScreen
        started={overlayVisible}
        onStarted={() => setOverlayVisible(true)}
        useOctree={useOctree}
      />
      {showPrompt && deviceType != 1 && map === 1 && (
        <div className="centered-top-div">
          <h3>{player ? "Press E to exit craft" : "Press E to enter craft"}</h3>
        </div>
      )}
    </Suspense>
  );
}
