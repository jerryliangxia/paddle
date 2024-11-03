import React from "react";
import { useGLTF } from "@react-three/drei";

export default function Scene(props) {
  const { scene } = useGLTF(props.file);

  return (
    <group {...props} dispose={null}>
      <primitive object={scene} />
    </group>
  );
}
