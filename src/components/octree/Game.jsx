import React from "react";
import { useGLTF } from "@react-three/drei";
import Player from "../../hooks/octree/Player.jsx";
import useOctree from "../../hooks/octree/useOctree.jsx";
// import useOctreeHelper from "../../hooks/octree/useOctreeHelper.jsx";

// Octree Game
export default function Game() {
  const { scene } = useGLTF("/geom3_borders1.glb");
  const octree = useOctree(scene);
  // useOctreeHelper(octree);

  return (
    <>
      <Player octree={octree} />
    </>
  );
}
