import React, { useRef, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useGame } from "../../stores/useGame.js";
import * as THREE from "three";

export default function Collider() {
  const map = useGame((state) => state.map);
  const { nodes } = useGLTF(
    map === 0 ? "/geom3_borders.glb" : "/giant_plane.glb"
  );
  const colliderRef = useRef();

  useEffect(() => {
    if (colliderRef.current) {
      colliderRef.current.layers.set(1);
    }
  }, []);

  return (
    <RigidBody colliders="trimesh" type="fixed">
      {map === 0 ? (
        <mesh ref={colliderRef} geometry={nodes.OutsideBorder.geometry}>
          <meshPhongMaterial opacity={0} transparent side={THREE.DoubleSide} />
        </mesh>
      ) : (
        <primitive object={nodes.Plane.geometry} />
      )}
    </RigidBody>
  );
}

useGLTF.preload("/geom3_borders.glb");
