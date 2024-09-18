import { useGLTF } from "@react-three/drei";
import React from "react";

export default function Model(props) {
  const { scene } = useGLTF("/geom3.glb");

  return (
    <group {...props} dispose={null}>
      <primitive object={scene} />
    </group>
  );
}