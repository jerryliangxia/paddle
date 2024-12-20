import { useRef, useState, useEffect, useMemo } from "react";
import { Capsule } from "three/examples/jsm/math/Capsule.js";
import { useFrame, useThree } from "@react-three/fiber";
import useKeyboard from "./useKeyboard";
import { useMultipleSounds } from "../useMultipleSounds";
import { useGame } from "../../stores/useGame";
import Dog from "../../components/octree/Model";
import FutureModel from "../../components/octree/FutureModel";
import * as THREE from "three";
import { Vector3 } from "three";
import { centerX, centerZ, halfDiameter } from "../../Constants";
// import { useControls } from "leva";

const STEPS_PER_FRAME = 5;

const waterSoundFiles = [
  "/sounds/water/1.mp3",
  "/sounds/water/2.mp3",
  "/sounds/water/3.mp3",
  "/sounds/water/4.mp3",
];

export default function Player({ octree }) {
  const {
    controlsMobile,
    prevDogPosition,
    setPrevDogPosition,
    player,
    setIsInSquare,
    map,
  } = useGame();
  const { camera } = useThree();

  const playAudio = true;

  const { upPressed, downPressed, leftPressed, rightPressed, shiftPressed } =
    controlsMobile;

  const playWaterMultipleSounds = useMultipleSounds(waterSoundFiles);

  function playWaterSound() {
    playWaterMultipleSounds();
  }

  const playerOnFloor = useRef(false);
  const playerVelocity = useMemo(() => new THREE.Vector3(), []);
  const travelDirection = useMemo(() => new THREE.Vector3(0, 0, -1), []);
  const capsule = useMemo(
    () =>
      new Capsule(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 1.25, 0),
        0.5
      ),
    []
  );

  const keyboard = useKeyboard();

  useEffect(() => {
    setPrevDogPosition(new THREE.Vector3(0, 1.25, 0));
    camera.lookAt(new THREE.Vector3(0, 1, -300));
  }, [map]);

  useEffect(() => {
    if (player) {
      const spawnPosition = new Vector3(
        prevDogPosition.x,
        1.25,
        prevDogPosition.z
      );
      capsule.end.copy(spawnPosition.clone());
      playerVelocity.set(0, 0, 0);
      camera.position.copy(spawnPosition);
      capsule.start.copy(spawnPosition);
    }
  }, [player]);

  const canMove = () => {
    const fullscreenControl = document.querySelector(
      "#fullscreen-control-container"
    );
    return !(
      fullscreenControl &&
      getComputedStyle(fullscreenControl).display !== "none"
    );
  };

  function getForwardVector() {
    return travelDirection.clone().normalize();
  }

  const maxRotationSpeed = 0.005;
  const rotationAcceleration = 0.0005;
  const rotationDeceleration = 0.00008;
  const rotationalVelocity = useRef(0);

  const impulse = useRef(0);
  const impulseAcceleration = 0.5;
  const impulseDeceleration = 0.01;

  const baseSpeed = 36;
  const maxSpeed = 72;
  const shiftAcceleration = 0.1;
  const shiftDeceleration = 0.05;
  const currentSpeed = useRef(baseSpeed);

  function controlsWASD(delta) {
    if (keyboard["ShiftLeft"]) {
      currentSpeed.current = Math.min(
        currentSpeed.current + shiftAcceleration,
        maxSpeed
      );
    } else {
      currentSpeed.current = Math.max(
        currentSpeed.current - shiftDeceleration,
        baseSpeed
      );
    }

    currentSpeed.current = Math.min(currentSpeed.current, maxSpeed);

    const shiftSpeedDelta = currentSpeed.current * delta;

    // Handle forward and backward impulse accumulation
    if (keyboard["KeyW"]) {
      if (impulse.current < 0) {
        // If moving backward, slow down instead of moving forward
        impulse.current = Math.min(impulse.current + impulseDeceleration, 0);
      } else {
        impulse.current = Math.min(impulse.current + impulseAcceleration, 1);
      }
    } else if (keyboard["KeyS"]) {
      if (impulse.current > 0) {
        // If moving forward, slow down instead of moving backward
        impulse.current = Math.max(impulse.current - impulseDeceleration, 0);
      } else {
        impulse.current = Math.max(impulse.current - impulseAcceleration, -1);
      }
    } else {
      // Decelerate impulse when no key is pressed
      if (impulse.current > 0) {
        impulse.current = Math.max(impulse.current - impulseDeceleration, 0);
      } else if (impulse.current < 0) {
        impulse.current = Math.min(impulse.current + impulseDeceleration, 0);
      }
    }

    // Apply the accumulated impulse to the player velocity
    playerVelocity.add(
      getForwardVector().multiplyScalar(impulse.current * shiftSpeedDelta)
    );

    // Reverse rotation direction for A and D keys
    if (keyboard["KeyD"]) {
      rotationalVelocity.current = Math.max(
        rotationalVelocity.current - rotationAcceleration,
        -maxRotationSpeed
      );
    } else if (keyboard["KeyA"]) {
      rotationalVelocity.current = Math.min(
        rotationalVelocity.current + rotationAcceleration,
        maxRotationSpeed
      );
    } else {
      // Decelerate rotation when no key is pressed
      if (rotationalVelocity.current > 0) {
        rotationalVelocity.current = Math.max(
          rotationalVelocity.current - rotationDeceleration,
          0
        );
      } else if (rotationalVelocity.current < 0) {
        rotationalVelocity.current = Math.min(
          rotationalVelocity.current + rotationDeceleration,
          0
        );
      }
    }

    travelDirection.applyAxisAngle(
      new THREE.Vector3(0, 1, 0),
      rotationalVelocity.current
    );
  }

  function updatePlayer(delta, octree, capsule, playerVelocity) {
    let damping = Math.exp(-8 * delta) - 1;
    playerVelocity.addScaledVector(playerVelocity, damping);
    const deltaPosition = playerVelocity.clone().multiplyScalar(delta);
    capsule.translate(deltaPosition);
    playerCollisions(capsule, octree);

    return true;
  }

  function playerCollisions(capsule, octree) {
    const result = octree.capsuleIntersect(capsule);
    if (result) {
      capsule.translate(result.normal.multiplyScalar(result.depth));
    }
    return true;
  }

  function teleportPlayerIfOob(capsule, playerVelocity) {
    if (capsule.end.y <= -100) {
      playerVelocity.set(0, 0, 0);
      capsule.start.set(0, 10, 0);
      capsule.end.set(0, 11, 0);
    }
  }

  const [isSoundPlayed, setIsSoundPlayed] = useState(false);
  const [lastPlayed, setLastPlayed] = useState(Date.now());

  const modelGroup = useMemo(() => new THREE.Group(), []);

  useFrame(({ camera }, delta) => {
    controlsWASD(delta);
    const velocityMagnitude = playerVelocity.length();
    if (playerOnFloor.current) {
      if (playAudio) {
        if (
          velocityMagnitude > 1 &&
          !isSoundPlayed &&
          Date.now() - lastPlayed > 1000
        ) {
          setIsSoundPlayed(true);
          playWaterSound();
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
        deltaSteps,
        octree,
        capsule,
        playerVelocity
      );
    }
    teleportPlayerIfOob(capsule, playerVelocity);

    // Update the camera position to follow the capsule
    camera.position.copy(capsule.end);

    // Update the model position and orientation
    const positionTarget = capsule.end.clone();
    positionTarget.y = 0;
    modelGroup.position.copy(positionTarget);

    const lookAtTarget = capsule.end.clone().add(travelDirection);
    lookAtTarget.y = 0;
    modelGroup.lookAt(lookAtTarget);

    // Check if player is within the square
    const { x, z } = capsule.end;
    const isInSquare =
      x >= centerX - halfDiameter &&
      x <= centerX + halfDiameter &&
      z >= centerZ - halfDiameter &&
      z <= centerZ + halfDiameter;

    setIsInSquare(isInSquare);
    setPrevDogPosition(camera.position);
  });

  useEffect(() => {
    keyboard["KeyW"] = upPressed;
    keyboard["KeyS"] = downPressed;
    keyboard["KeyA"] = leftPressed;
    keyboard["KeyD"] = rightPressed;
    keyboard["ShiftLeft"] = shiftPressed;
  }, [upPressed, downPressed, leftPressed, rightPressed, shiftPressed]);

  const dogRef = useRef();

  useFrame(() => {
    if (dogRef.current) {
      const forwardVector = travelDirection.clone().normalize().setLength(4.0);
      const newPosition = modelGroup.position.clone().add(forwardVector);

      dogRef.current.position.copy(newPosition);
      dogRef.current.rotation.copy(modelGroup.rotation);
    }
  });

  return map === 0 ? <Dog ref={dogRef} /> : <FutureModel ref={dogRef} />;
}
