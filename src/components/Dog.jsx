import React, { useRef, useEffect, useState } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";

export default function Dog(props) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF("/dog.glb");
  const { actions } = useAnimations(animations, group);

  const [currentAction, setCurrentAction] = useState("Idle1");
  const [idleCount, setIdleCount] = useState(0);

  // Constants for idle loops
  const MIN_IDLE_LOOPS = 2;
  const MAX_IDLE_LOOPS = 3;

  const specialActions = ["Idle1LongSniffAround", "Idle1LookRight"];

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

      if (currentAction === "Idle1") {
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
        <mesh
          name="Circle"
          geometry={nodes.Circle.geometry}
          material={materials.Eyes}
          position={[0, 1.382, 0.345]}
          rotation={[0.308, 0, 0]}
          scale={[0.426, 0.309, 0.309]}
        />
        <mesh
          name="Circle001"
          geometry={nodes.Circle001.geometry}
          material={materials.Eyes}
          position={[0, 0.745, -0.222]}
          rotation={[0.998, 0, 0]}
          scale={[0.426, 0.309, 0.309]}
        />
        <group name="Dog">
          <group name="DogMesh">
            <skinnedMesh
              name="Cube001"
              geometry={nodes.Cube001.geometry}
              material={materials.Base}
              skeleton={nodes.Cube001.skeleton}
            />
            <skinnedMesh
              name="Cube001_1"
              geometry={nodes.Cube001_1.geometry}
              material={materials.Eyes}
              skeleton={nodes.Cube001_1.skeleton}
            />
          </group>
          <primitive object={nodes.spine004} />
        </group>
        <mesh
          name="JacketMesh001"
          geometry={nodes.JacketMesh001.geometry}
          material={materials.Lifejacket}
          position={[0, 1.425, -0.293]}
          rotation={[2.438, 0, Math.PI]}
          scale={0.725}
        />
      </group>
    </group>
  );
}

useGLTF.preload("/dog.glb");
