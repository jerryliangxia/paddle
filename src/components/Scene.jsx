import React from "react";
import { useGLTF } from "@react-three/drei";

export default function Model(props) {
  const { scene } = useGLTF("/geom4.glb");

  return (
    <group {...props} dispose={null}>
      <primitive object={scene} />
    </group>
  );
}
