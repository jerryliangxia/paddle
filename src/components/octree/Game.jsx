import React, { useState, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import Player from "../../hooks/octree/Player.jsx";
import GroundPlayerPreface from "../../hooks/octree/GroundPlayerPreface.jsx";
import useOctree from "../../hooks/octree/useOctree.jsx";
import { useGame } from "../../stores/useGame.js";

export default function Game() {
  const map = useGame((state) => state.map);
  const { scene } = useGLTF(
    map === 0 ? "/geom3_borders1.glb" : "/giant_plane2.glb"
  );
  const octree = useOctree(scene);

  const [isPlayer, setIsPlayer] = useState(true);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "e" || event.key === "E") {
        setIsPlayer((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      {isPlayer ? (
        <Player octree={octree} />
      ) : (
        <GroundPlayerPreface octree={octree} />
      )}
    </>
  );
}
