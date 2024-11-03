import React, { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";

export const PlayerLight = React.memo(function PlayerLight({ player }) {
  const lightRef = useRef();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (lightRef.current) {
      lightRef.current.name = "followLight";
      setIsReady(true);
    }
  }, []);

  useFrame(() => {
    if (isReady && lightRef.current && player.current) {
      const playerPosition = player.current.translation();

      lightRef.current.position.x = playerPosition.x + 1;
      lightRef.current.position.y = playerPosition.y + 10;
      lightRef.current.position.z = playerPosition.z + 1;

      lightRef.current.target.position.copy(player.current.translation());
      lightRef.current.target.updateMatrixWorld();
    }
  });

  return (
    <directionalLight ref={lightRef} intensity={8} color={0xffffff}>
      <object3D />
    </directionalLight>
  );
});
