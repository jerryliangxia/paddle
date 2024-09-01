import React, { useRef } from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import * as THREE from "three";
import { PlayerLight } from "./PlayerLight";
import { useGame } from "../stores/useGame";
import Dog from "./Dog";

export default function Player(props) {
  const body = useRef();
  const visualGroup = useRef();
  const { controlsMobile } = useGame();
  const deviceType = useGame((state) => state.deviceType);

  const { nodes } = useGLTF("/paddle.glb");
  const texture = useTexture("/img/paddleboard.png");
  const [subscribeKeys, getKeys] = useKeyboardControls();

  useFrame((state, delta) => {
    const bodyPosition = body.current.translation();

    const cameraPosition = new THREE.Vector3();
    cameraPosition.copy(bodyPosition);
    cameraPosition.y += 1.25;

    state.camera.position.copy(cameraPosition);
  });

  useFrame((state, delta) => {
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

    const speedMultiplier = shift ? 2.5 : 1;
    const impulseStrength = 0.5 * delta * speedMultiplier;
    const torqueStrength = 0.25 * delta * speedMultiplier;

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
    if (rightward) {
      torque.y -= torqueStrength * 2;
    }
    if (leftward) {
      torque.y += torqueStrength * 2;
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
    visualGroup.current.quaternion.set(
      bodyRotation.x,
      bodyRotation.y,
      bodyRotation.z,
      bodyRotation.w
    );
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
        <CuboidCollider args={[0.5, 0.1, 2.4]} position={[0, 0, -0.42]} />
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
    </group>
  );
}
useGLTF.preload("/paddle.glb");
