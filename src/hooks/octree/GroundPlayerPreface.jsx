import { useGLTF } from "@react-three/drei";
import React, { useRef } from "react";
import SphereCollider from "./SphereCollider";
import Ball from "./Ball";
import useOctree from "./useOctree";
import Player from "./GroundPlayer";
import * as Constants from "../../Constants";

const GroundPlayerPreface = React.memo(() => {
  const { scene } = useGLTF("/giant_plane2.glb");
  const octree = useOctree(scene);
  // useOctreeHelper(octree);

  const { scene: bouncyScene } = useGLTF("/bouncy_scene.glb");
  const octreeBouncy = useOctree(bouncyScene);
  // useOctreeHelper(octreeBouncy);

  const { scene: ballHitScene } = useGLTF("/ball_hit_scene.glb");
  const octreeBallHit = useOctree(ballHitScene);
  // useOctreeHelper(octreeBallHit);

  const colliders = useRef([]);

  function checkSphereCollisions(sphere, velocity) {
    for (let i = 0, length = colliders.current.length; i < length; i++) {
      const c = colliders.current[i];

      if (c.sphere) {
        const d2 = sphere.center.distanceToSquared(c.sphere.center);
        const r = sphere.radius + c.sphere.radius;
        const r2 = r * r;

        if (d2 < r2) {
          const normal = Constants.v1
            .subVectors(sphere.center, c.sphere.center)
            .normalize();
          const impact1 = Constants.v2
            .copy(normal)
            .multiplyScalar(normal.dot(velocity));
          const impact2 = Constants.v3
            .copy(normal)
            .multiplyScalar(normal.dot(c.velocity));
          velocity.add(impact2).sub(impact1);
          c.velocity.add(impact1).sub(impact2);
          const d = (r - Math.sqrt(d2)) / 2;
          sphere.center.addScaledVector(normal, d);
          c.sphere.center.addScaledVector(normal, -d);
        }
      } else if (c.capsule) {
        const center = Constants.v1
          .addVectors(c.capsule.start, c.capsule.end)
          .multiplyScalar(0.5);
        const r = sphere.radius + c.capsule.radius;
        const r2 = r * r;
        for (const point of [c.capsule.start, c.capsule.end, center]) {
          const d2 = point.distanceToSquared(sphere.center);
          if (d2 < r2) {
            const normal = Constants.v1
              .subVectors(point, sphere.center)
              .normalize();
            const impact1 = Constants.v2
              .copy(normal)
              .multiplyScalar(normal.dot(c.velocity));
            const impact2 = Constants.v3
              .copy(normal)
              .multiplyScalar(normal.dot(velocity));
            c.velocity.add(impact2).sub(impact1);
            velocity.add(impact1).sub(impact2);
            const d = (r - Math.sqrt(d2)) / 2;
            sphere.center.addScaledVector(normal, -d);
          }
        }
      }
    }
  }

  return (
    <>
      {Constants.balls.map(({ position }, i) => (
        <SphereCollider
          key={i}
          id={i}
          radius={Constants.radius}
          octree={octree}
          octreeBouncy={octreeBouncy}
          octreeBallHit={octreeBallHit}
          position={position}
          colliders={colliders.current}
          checkSphereCollisions={checkSphereCollisions}
        >
          <Ball radius={Constants.radius} />
        </SphereCollider>
      ))}
      <Player
        ballCount={Constants.ballCount}
        octree={octree}
        octreeBallHit={octreeBallHit}
        octreeBouncy={octreeBouncy}
        colliders={colliders.current}
      />
    </>
  );
});

export default GroundPlayerPreface;
