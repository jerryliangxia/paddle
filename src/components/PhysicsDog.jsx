import React, { useRef, useEffect, useState } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";

export default function PhysicsDog(props) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF("/dog.glb");
  const { actions } = useAnimations(animations, group);

  const [currentAction, setCurrentAction] = useState("Idle1");
  const [idleCount, setIdleCount] = useState(0);

  // Constants for idle loops
  const MIN_IDLE_LOOPS = 2;
  const MAX_IDLE_LOOPS = 3;

  const specialActions = [
    "Idle1LongSniffAround",
    "Idle1LookRight",
    "Idle1LookAhead",
    "Idle1AdjustFeet",
  ];

  useEffect(() => {
    let currentAnimationAction = null;

    const playNextAnimation = () => {
      if (currentAction === "Idle1") {
        setIdleCount((prevCount) => prevCount + 1);
        const maxLoops =
          Math.floor(Math.random() * (MAX_IDLE_LOOPS - MIN_IDLE_LOOPS + 1)) +
          MIN_IDLE_LOOPS;

        if (idleCount >= maxLoops) {
          setIdleCount(0);
          const nextSpecialAction =
            specialActions[Math.floor(Math.random() * specialActions.length)];
          setCurrentAction(nextSpecialAction);
        }
      } else {
        setCurrentAction("Idle1");
      }
    };

    Object.values(actions).forEach((action) => action.stop());

    if (actions[currentAction]) {
      currentAnimationAction = actions[currentAction];
      currentAnimationAction.reset().play();
      currentAnimationAction.clampWhenFinished = true;

      if (currentAction === "Idle1LongSniffAround") {
        currentAnimationAction.setLoop(THREE.LoopRepeat, 1);
      } else {
        currentAnimationAction.setLoop(THREE.LoopOnce, 1);
      }

      currentAnimationAction.reset().play();
    }

    const checkAnimationFinished = () => {
      if (currentAnimationAction && !currentAnimationAction.isRunning()) {
        playNextAnimation();
      }
    };

    const animationCheckInterval = setInterval(checkAnimationFinished, 100);

    return () => {
      clearInterval(animationCheckInterval);
      if (currentAnimationAction) {
        currentAnimationAction.stop();
      }
    };
  }, [actions, currentAction, idleCount]);

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="Dog">
          <group name="DogMesh">
            <skinnedMesh
              name="Cube001"
              geometry={nodes.Cube001.geometry}
              skeleton={nodes.Cube001.skeleton}
            >
              <meshStandardMaterial
                attach="material"
                color={materials.Base.color}
                roughness={0.5}
                metalness={0.5}
              />
            </skinnedMesh>
            <skinnedMesh
              name="Cube001_1"
              geometry={nodes.Cube001_1.geometry}
              skeleton={nodes.Cube001_1.skeleton}
            >
              <meshStandardMaterial
                attach="material"
                color={materials.Eyes.color}
                roughness={0.5}
                metalness={0.5}
              />
            </skinnedMesh>
          </group>
          <primitive object={nodes.spine004} />
        </group>
        <group
          name="JacketMesh001"
          position={[0, 1.425, -0.293]}
          rotation={[2.438, 0, Math.PI]}
          scale={0.725}
        >
          <mesh name="Plane003" geometry={nodes.Plane003.geometry}>
            <meshStandardMaterial
              attach="material"
              color={materials.Lifejacket.color}
              roughness={1.0}
              metalness={1.0}
            />
          </mesh>
          <mesh name="Plane003_1" geometry={nodes.Plane003_1.geometry}>
            <meshStandardMaterial
              attach="material"
              color={materials.Gray.color}
              roughness={0.8}
              metalness={0.8}
            />
          </mesh>
        </group>
        <mesh
          name="Plane"
          geometry={nodes.Plane.geometry}
          position={[0.02, -0.033, -0.057]}
          rotation={[0.054, -0.003, 0.031]}
        >
          <meshStandardMaterial
            attach="material"
            color={materials.ShinyGray.color}
            roughness={0.8}
            metalness={0.2}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </group>
  );
}

useGLTF.preload("/dog.glb");
