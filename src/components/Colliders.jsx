import React, { useRef, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import * as THREE from "three";

export default function Collider() {
  const { nodes } = useGLTF("/geom3_borders.glb");
  const colliderRef = useRef();

  useEffect(() => {
    if (colliderRef.current) {
      colliderRef.current.layers.set(1);
    }
  }, []);

  return (
    <RigidBody colliders="trimesh" type="fixed">
      <mesh ref={colliderRef} geometry={nodes.OutsideBorder.geometry}>
        <meshPhongMaterial opacity={0} transparent side={THREE.DoubleSide} />
      </mesh>
    </RigidBody>
  );
}

useGLTF.preload("/geom3_borders.glb");
