import React from "react";

export default function Lights() {
  return (
    <>
      <ambientLight intensity={1.0} />
      <hemisphereLight
        skyColor={"white"}
        groundColor={"black"}
        intensity={2}
        position={[0, 100, 0]}
      />
      <directionalLight
        color={"white"}
        intensity={0.1}
        position={[-50, 37.5, 50]}
      />
    </>
  );
}
