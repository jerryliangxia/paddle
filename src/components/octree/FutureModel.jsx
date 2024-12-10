import React, { forwardRef } from "react";
import { useGLTF } from "@react-three/drei";

// Octree Dog
const Model = forwardRef((props, ref) => {
  const { nodes, materials } = useGLTF("/future_paddle.glb");

  return (
    <group ref={ref} {...props} scale={0.5} dispose={null}>
      <group
        dispose={null}
        scale={1.2}
        rotation={[0, Math.PI, 0]}
        position={[0, 0, -8]}
      >
        <mesh geometry={nodes.Cube006.geometry} material={materials.Material} />
        <mesh
          geometry={nodes.Cube006_1.geometry}
          material={materials["Future Grey 1"]}
        />
      </group>
    </group>
  );
});

useGLTF.preload("/future_paddle.glb");

export default Model;
