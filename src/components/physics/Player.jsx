import React, { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useTexture, useKeyboardControls } from "@react-three/drei";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import * as THREE from "three";
import { PlayerLight } from "./PlayerLight";
import { useGame } from "../../stores/useGame";
import Dog from "./Dog";

export default function Player(props) {
  const body = useRef();
  const visualGroup = useRef();
  const transitionMesh = useRef();
  const { controlsMobile } = useGame();
  const deviceType = useGame((state) => state.deviceType);
  const overlayVisible = useGame((state) => state.overlayVisible);
  const desktopControl = useGame((state) => state.desktopControl);

  const { nodes } = useGLTF("/paddle.glb");
  const texture = useTexture("/img/paddleboard.png");
  const [subscribeKeys, getKeys] = useKeyboardControls();

  const lookUpPosition = 2.4;
  const stablePosition = 1.1;

  const impulseValue = 1.5;
  const torqueValue = impulseValue * 0.5;

  const shiftMultiplier = 3.75;

  const [transitionStart, setTransitionStart] = useState(null);

  useEffect(() => {
    if (overlayVisible) {
      setTransitionStart(Date.now());
    }
  }, [overlayVisible]);

  useFrame((state, delta) => {
    if (!body || !body.current) return;
    const bodyPosition = body.current.translation();

    const cameraPosition = new THREE.Vector3();
    cameraPosition.copy(bodyPosition);
    cameraPosition.y += 1.25;

    // come up
    if (!overlayVisible) {
      // Position transitionMesh in front of the camera
      const forwardDirection = new THREE.Vector3(0, 0, -1);
      forwardDirection.applyQuaternion(state.camera.quaternion);
      forwardDirection.normalize();

      transitionMesh.current.position.set(
        bodyPosition.x + forwardDirection.x * 2,
        lookUpPosition,
        bodyPosition.z + forwardDirection.z * 2
      );

      const lookAtPosition = transitionMesh.current.position;

      const currentLookAtPosition = state.camera
        .getWorldDirection(new THREE.Vector3())
        .add(state.camera.position);

      const targetLookAtPosition = lookAtPosition.clone();
      const lerpedLookAtPosition = currentLookAtPosition.lerp(
        targetLookAtPosition,
        0.1
      );

      state.camera.lookAt(lerpedLookAtPosition);
      state.camera.position.copy(cameraPosition);

      // come down
    } else if (transitionStart) {
      const elapsed = (Date.now() - transitionStart) / 1000;
      const t = Math.min(elapsed / 0.5, 1);

      // Calculate forward direction
      const forwardDirection = new THREE.Vector3(0, 0, -1);
      forwardDirection.applyQuaternion(state.camera.quaternion);
      forwardDirection.normalize();

      // Set transitionMesh position in front of the player
      transitionMesh.current.position.set(
        bodyPosition.x + forwardDirection.x * 2,
        stablePosition,
        bodyPosition.z + forwardDirection.z * 2
      );

      const lookAtPosition = transitionMesh.current.position;

      const currentLookAtPosition = state.camera
        .getWorldDirection(new THREE.Vector3())
        .add(state.camera.position);

      const targetLookAtPosition = lookAtPosition.clone();
      const lerpedLookAtPosition = currentLookAtPosition.lerp(
        targetLookAtPosition,
        0.1
      );

      state.camera.lookAt(lerpedLookAtPosition);
      state.camera.position.copy(cameraPosition);

      if (t === 1) {
        setTransitionStart(null);
      }
    } else {
      state.camera.position.copy(cameraPosition);
    }
  });

  useFrame((state, delta) => {
    if (!body || !body.current) return;

    let forward, backward, leftward, rightward, shift;

    if (deviceType === 1) {
      // Mobile
      forward = controlsMobile.upPressed;
      backward = controlsMobile.downPressed;
      leftward = controlsMobile.leftPressed;
      rightward = controlsMobile.rightPressed;
      shift = controlsMobile.shiftPressed;
    } else {
      // Desktop
      forward = getKeys().forward;
      backward = getKeys().backward;
      leftward = getKeys().left;
      rightward = getKeys().right;
      shift = getKeys().shift;
    }

    const impulse = { x: 0, y: 0, z: 0 };
    const torque = { x: 0, y: 0, z: 0 };

    const speedMultiplier = shift ? shiftMultiplier : 1;
    const impulseStrength = impulseValue * delta * speedMultiplier;
    const torqueStrength = torqueValue * delta * speedMultiplier;

    const forwardDirection = new THREE.Vector3(0, 0, -1);
    forwardDirection.applyQuaternion(visualGroup.current.quaternion);
    forwardDirection.y = 0;
    forwardDirection.normalize();

    const rightDirection = new THREE.Vector3(1, 0, 0);
    rightDirection.applyQuaternion(visualGroup.current.quaternion);
    rightDirection.y = 0;
    rightDirection.normalize();

    if (forward) {
      impulse.x += forwardDirection.x * impulseStrength;
      impulse.z += forwardDirection.z * impulseStrength;
      torque.x -= torqueStrength;
    }
    if (backward) {
      impulse.x -= forwardDirection.x * impulseStrength;
      impulse.z -= forwardDirection.z * impulseStrength;
      torque.x += torqueStrength;
    }

    if (!desktopControl) {
      if (leftward) {
        impulse.x -= rightDirection.x * impulseStrength;
        impulse.z -= rightDirection.z * impulseStrength;
      }
      if (rightward) {
        impulse.x += rightDirection.x * impulseStrength;
        impulse.z += rightDirection.z * impulseStrength;
      }

      const cameraQuaternion = state.camera.quaternion.clone();
      const cameraEuler = new THREE.Euler().setFromQuaternion(
        cameraQuaternion,
        "YXZ"
      );

      const boatEuler = new THREE.Euler(
        visualGroup.current.rotation.x,
        cameraEuler.y,
        visualGroup.current.rotation.z
      );

      visualGroup.current.rotation.copy(boatEuler);
    } else {
      if (rightward) {
        torque.y -= torqueStrength * 2;
      }
      if (leftward) {
        torque.y += torqueStrength * 2;
      }
    }

    body.current.applyImpulse(impulse);
    body.current.applyTorqueImpulse(torque);

    const bodyPosition = body.current.translation();
    const bodyRotation = body.current.rotation();
    visualGroup.current.position.set(
      bodyPosition.x,
      bodyPosition.y,
      bodyPosition.z
    );
    if (desktopControl) {
      visualGroup.current.quaternion.set(
        bodyRotation.x,
        bodyRotation.y,
        bodyRotation.z,
        bodyRotation.w
      );
    }
  });

  return (
    <group {...props} dispose={null}>
      <RigidBody
        ref={body}
        canSleep={false}
        colliders="cuboid"
        friction={0}
        linearDamping={0.5}
        angularDamping={0.5}
        enabledRotations={[false, true, false]}
      >
        <CuboidCollider
          args={desktopControl ? [0.5, 0.1, 2.4] : [0.8, 0.1, 0.8]}
          position={[0, 0, -0.42]}
        />
      </RigidBody>
      <group ref={visualGroup} scale={0.5}>
        <Dog
          rotation={[0, (-4.5 * Math.PI) / 4, 0]}
          position={[0, 0.5, -3.2]}
          scale={0.6}
        />
        <mesh geometry={nodes.BottomYellow.geometry}>
          <meshStandardMaterial
            color={0xffe600}
            metalness={0.5}
            roughness={1}
          />
        </mesh>
        <mesh geometry={nodes.Top.geometry}>
          <meshBasicMaterial
            map={texture}
            map-flipY={false}
            metalness={1}
            roughness={1}
          />
        </mesh>
        <mesh geometry={nodes.Cube007.geometry}>
          <meshStandardMaterial
            map={texture}
            map-flipY={false}
            metalness={0}
            roughness={1}
          />
        </mesh>
        <mesh geometry={nodes.Cube007_1.geometry}>
          <meshStandardMaterial color={0x000000} metalness={0} roughness={1} />
        </mesh>
        <mesh geometry={nodes.Cube007_2.geometry}>
          <meshStandardMaterial color={0xffe600} metalness={1} roughness={1} />
        </mesh>
      </group>
      <PlayerLight player={body} />
      {/* Invisible transition mesh */}
      <mesh ref={transitionMesh} visible={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color={0x00ff00} />
      </mesh>
    </group>
  );
}
useGLTF.preload("/paddle.glb");
