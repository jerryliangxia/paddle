import { useRef, useState, useEffect, useMemo } from "react";
import { Capsule } from "three/examples/jsm/math/Capsule.js";
import { Vector3, Mesh, BoxGeometry, MeshBasicMaterial, Group } from "three";
import { useFrame } from "@react-three/fiber";
import useKeyboard from "./useKeyboard";
import { useMultipleSounds } from "./useMultipleSounds";
import { useGame } from "../stores/useGame";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { useControls } from "leva";

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
  const travelDirection = useMemo(() => new Vector3(0, 0, -1), []); // Initial travel direction
  const capsule = useMemo(
    () => new Capsule(new Vector3(0, 0, 0), new Vector3(0, 3, 0), 0.5),
    []
  );

  const keyboard = useKeyboard();

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

  function controlsWASD(delta) {
    const shiftSpeedDelta = (keyboard["ShiftLeft"] ? 108 : 36) * delta;
    const rotationSpeed = 0.05; // Rotation speed for turning

    // Handle forward and backward movement
    if (keyboard["KeyW"]) {
      playerVelocity.add(getForwardVector().multiplyScalar(shiftSpeedDelta));
    }
    if (keyboard["KeyS"]) {
      playerVelocity.add(getForwardVector().multiplyScalar(-shiftSpeedDelta));
    }

    // Handle rotation
    if (keyboard["KeyD"]) {
      travelDirection.applyAxisAngle(new Vector3(0, 1, 0), -rotationSpeed);
    }
    if (keyboard["KeyA"]) {
      travelDirection.applyAxisAngle(new Vector3(0, 1, 0), rotationSpeed);
    }
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

  // Load the 3D model
  const { nodes, materials } = useGLTF("/paddle.glb");

  // Create a group to hold the model parts
  const modelGroup = useMemo(() => {
    const group = new THREE.Group();

    // Add each mesh to the group
    group.add(
      new THREE.Mesh(nodes.BaseColliders.geometry, materials.Paddleboard),
      new THREE.Mesh(nodes.BottomYellow.geometry, materials.Yellow),
      new THREE.Mesh(nodes.Top.geometry, materials.Top),
      new THREE.Mesh(nodes.Cube007.geometry, materials.Paddleboard),
      new THREE.Mesh(nodes.Cube007_1.geometry, materials.Black),
      new THREE.Mesh(nodes.Cube007_2.geometry, materials.Yellow)
    );

    // Optionally, apply transformations
    group.scale.set(0.5, 0.5, 0.5); // Scale the model

    return group;
  }, [nodes, materials]);

  // Customizable y-offset
  const yOffset = -5; // Adjust this value to shift the model down

  // Use Leva's useControls to create UI controls for rotation
  const { rotationX, rotationY, rotationZ } = useControls({
    rotationX: {
      value: -Math.PI / 2,
      min: -Math.PI,
      max: Math.PI,
      step: 0.01,
      label: "Rotation X",
    },
    rotationY: {
      value: 0,
      min: -Math.PI,
      max: Math.PI,
      step: 0.01,
      label: "Rotation Y",
    },
    rotationZ: {
      value: Math.PI / 2,
      min: -Math.PI,
      max: Math.PI,
      step: 0.01,
      label: "Rotation Z",
    },
  });

  useFrame(({ camera, scene }, delta) => {
    controlsWASD(delta);
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
    modelGroup.position.copy(capsule.end);
    modelGroup.position.y += yOffset; // Shift the model down by yOffset
    modelGroup.rotation.set(rotationX, rotationY, rotationZ); // Apply rotation controls
    modelGroup.lookAt(capsule.end.clone().add(travelDirection));

    // Add the model to the scene if not already added
    if (!scene.children.includes(modelGroup)) {
      scene.add(modelGroup);
    }
  });

  useEffect(() => {
    keyboard["KeyW"] = upPressed;
    keyboard["KeyS"] = downPressed;
    keyboard["KeyA"] = leftPressed;
    keyboard["KeyD"] = rightPressed;
    keyboard["ShiftLeft"] = shiftPressed;
  }, [upPressed, downPressed, leftPressed, rightPressed, shiftPressed]);
}
