import React from "react";
import { useGLTF } from "@react-three/drei";
import Player from "../../hooks/octree/Player.jsx";
import useOctree from "../../hooks/octree/useOctree.jsx";
import { useGame } from "../../stores/useGame.js";
// import useOctreeHelper from "../../hooks/octree/useOctreeHelper.jsx";

// Octree Game
export default function Game() {
  const map = useGame((state) => state.map);
  const { scene } = useGLTF(
    map === 0 ? "/geom3_borders1.glb" : "/giant_plane.glb"
  );
  const octree = useOctree(scene);
  // useOctreeHelper(octree);

  return (
    <>
      <Player octree={octree} />
    </>
  );
}
