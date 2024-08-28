import React, { useRef } from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import * as THREE from "three";

export default function Player(props) {
  const body = useRef();
  const visualGroup = useRef();

  const { nodes, materials } = useGLTF("/paddle.glb");
  const texture = useTexture("/img/paddleboard.png");
  const [subscribeKeys, getKeys] = useKeyboardControls();

  useFrame((state, delta) => {
    const bodyPosition = body.current.translation();

    const cameraPosition = new THREE.Vector3();
    cameraPosition.copy(bodyPosition);
    cameraPosition.y += 2.9;

    state.camera.position.copy(cameraPosition);
  });

  useFrame((state, delta) => {
    const { forward, backward, leftward, rightward, shift } = getKeys();

    const impulse = { x: 0, y: 0, z: 0 };
    const torque = { x: 0, y: 0, z: 0 };

    const impulseStrength = 6 * delta;
    const torqueStrength = 2 * delta;

    // Get the forward direction of the visualGroup
    const forwardDirection = new THREE.Vector3(0, 0, -1);
    forwardDirection.applyQuaternion(visualGroup.current.quaternion);
    forwardDirection.y = 0; // Keep movement in the horizontal plane
    forwardDirection.normalize();

    // Get the right direction of the visualGroup
    const rightDirection = new THREE.Vector3(1, 0, 0);
    rightDirection.applyQuaternion(visualGroup.current.quaternion);
    rightDirection.y = 0; // Keep movement in the horizontal plane
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
        enabledRotations={[true, true, false]}
      >
        <mesh geometry={nodes.BaseColliders.geometry}>
          <meshPhongMaterial opacity={0} transparent />
        </mesh>
      </RigidBody>
      <group ref={visualGroup}>
        <mesh
          geometry={nodes.BottomYellow.geometry}
          material={materials.Yellow}
        />
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
            roughness={0}
          />
        </mesh>
        <mesh geometry={nodes.Cube007_1.geometry} material={materials.Black} />
        <mesh geometry={nodes.Cube007_2.geometry} material={materials.Yellow} />
      </group>
    </group>
  );
}

useGLTF.preload("/paddle.glb");
