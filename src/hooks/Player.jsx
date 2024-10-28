import { useRef, useState, useEffect, useMemo } from "react";
import { Capsule } from "three/examples/jsm/math/Capsule.js";
import { Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import useKeyboard from "./useKeyboard";
import { useMultipleSounds } from "./useMultipleSounds";
import { useGame } from "../stores/useGame";

const STEPS_PER_FRAME = 5;

const waterSoundFiles = [
  "/sounds/water/1.mp3",
  "/sounds/water/2.mp3",
  "/sounds/water/3.mp3",
  "/sounds/water/4.mp3",
];

export default function Player({ octree }) {
  const { controlsMobile } = useGame();
  const playAudio = true;

  const { upPressed, downPressed, leftPressed, rightPressed, shiftPressed } =
    controlsMobile;

  const playRandomWaterSound = useMultipleSounds(waterSoundFiles);

  function playFootstep() {
    playRandomWaterSound();
  }

  const playerOnFloor = useRef(false);
  const playerVelocity = useMemo(() => new Vector3(), []);
  const playerDirection = useMemo(() => new Vector3(), []);
  const capsule = useMemo(
    () => new Capsule(new Vector3(0, 0, 0), new Vector3(0, 3, 0), 0.5),
    []
  );

  const keyboard = useKeyboard();

  const canMove = () => {
    const fullscreenControl = document.querySelector(
      "#fullscreen-control-container"
    );
    // Check if the element exists and is visible
    return !(
      fullscreenControl &&
      getComputedStyle(fullscreenControl).display !== "none"
    );
  };

  function getForwardVector(camera, playerDirection) {
    camera.getWorldDirection(playerDirection);
    playerDirection.y = 0;
    playerDirection.normalize();
    return playerDirection;
  }

  function getSideVector(camera, playerDirection) {
    camera.getWorldDirection(playerDirection);
    playerDirection.y = 0;
    playerDirection.normalize();
    playerDirection.cross(camera.up);
    return playerDirection;
  }

  function controlsWASD(camera, delta, playerVelocity, playerDirection) {
    if (!canMove()) return;
    const shiftSpeedDelta = (keyboard["ShiftLeft"] ? 108 : 36) * delta;
    keyboard["KeyA"] &&
      playerVelocity.add(
        getSideVector(camera, playerDirection).multiplyScalar(-shiftSpeedDelta)
      );
    keyboard["KeyD"] &&
      playerVelocity.add(
        getSideVector(camera, playerDirection).multiplyScalar(shiftSpeedDelta)
      );
    keyboard["KeyW"] &&
      playerVelocity.add(
        getForwardVector(camera, playerDirection).multiplyScalar(
          shiftSpeedDelta
        )
      );
    keyboard["KeyS"] &&
      playerVelocity.add(
        getForwardVector(camera, playerDirection).multiplyScalar(
          -shiftSpeedDelta
        )
      );
  }

  function updatePlayer(camera, delta, octree, capsule, playerVelocity) {
    let damping = Math.exp(-8 * delta) - 1;
    playerVelocity.addScaledVector(playerVelocity, damping);
    const deltaPosition = playerVelocity.clone().multiplyScalar(delta);
    capsule.translate(deltaPosition);
    playerCollisions(capsule, octree);

    camera.position.copy(capsule.end);
    return true;
  }

  function playerCollisions(capsule, octree) {
    const result = octree.capsuleIntersect(capsule);
    if (result) {
      capsule.translate(result.normal.multiplyScalar(result.depth));
    }
    return true;
  }

  function teleportPlayerIfOob(camera, capsule, playerVelocity) {
    if (camera.position.y <= -100) {
      playerVelocity.set(0, 0, 0);
      capsule.start.set(0, 10, 0);
      capsule.end.set(0, 11, 0);
      camera.position.copy(capsule.end);
      camera.rotation.set(0, 0, 0);
    }
  }

  const [isSoundPlayed, setIsSoundPlayed] = useState(false);
  const [lastPlayed, setLastPlayed] = useState(Date.now());

  useFrame(({ camera }, delta) => {
    controlsWASD(camera, delta, playerVelocity, playerDirection);
    const velocityMagnitude = playerVelocity.length();
    if (playerOnFloor.current) {
      if (playAudio) {
        if (
          velocityMagnitude > 1 &&
          !isSoundPlayed &&
          Date.now() - lastPlayed > 500
        ) {
          setIsSoundPlayed(true);
          playFootstep();
          setLastPlayed(Date.now());
          setTimeout(() => {
            setIsSoundPlayed(false);
          }, 500);
        } else if (velocityMagnitude <= 1) {
          setIsSoundPlayed(false);
        }
      }
    }
    const deltaSteps = Math.min(0.05, delta) / STEPS_PER_FRAME;
    for (let i = 0; i < STEPS_PER_FRAME; i++) {
      playerOnFloor.current = updatePlayer(
        camera,
        deltaSteps,
        octree,
        capsule,
        playerVelocity
      );
    }
    teleportPlayerIfOob(camera, capsule, playerVelocity);
  });

  useEffect(() => {
    keyboard["KeyW"] = upPressed;
    keyboard["KeyS"] = downPressed;
    keyboard["KeyA"] = leftPressed;
    keyboard["KeyD"] = rightPressed;
    keyboard["ShiftLeft"] = shiftPressed;
  }, [upPressed, downPressed, leftPressed, rightPressed, shiftPressed]);
}
