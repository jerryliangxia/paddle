import React, { useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import Player from "../../hooks/octree/Player.jsx";
import GroundPlayerPreface from "../../hooks/octree/GroundPlayerPreface.jsx";
import useOctree from "../../hooks/octree/useOctree.jsx";
import { useGame } from "../../stores/useGame.js";
import useOctreeHelper from "../../hooks/octree/useOctreeHelper.jsx";

export default function Game() {
  const map = useGame((state) => state.map);
  const { scene } = useGLTF(
    map === 0 ? "/geom3_borders1.glb" : "/giant_plane2.glb"
  );
  const octree = useOctree(scene);

  const player = useGame((state) => state.player);
  const setPlayer = useGame((state) => state.setPlayer);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "e" || event.key === "E") {
        setPlayer(!player);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [player, setPlayer]);

  return (
    <>
      {player ? (
        <Player octree={octree} />
      ) : (
        <GroundPlayerPreface octree={octree} />
      )}
    </>
  );
}
