import React from "react";
import { Physics, RigidBody, CuboidCollider } from "@react-three/rapier";
import Player from "./Player.jsx";
import Colliders from "./Colliders.jsx";

// Physics Game
export default function Game() {
  return (
    <>
      <Physics>
        <RigidBody type="fixed" friction={0}>
          <CuboidCollider args={[1000, 0.1, 1000]} />
        </RigidBody>
        <Player />
        <Colliders />
      </Physics>
    </>
  );
}
