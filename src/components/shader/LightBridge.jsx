import lightBridgeVertexShader from "./light-bridge/vertex.glsl";
import lightBridgeFragmentShader from "./light-bridge/fragment.glsl";
import { extend, useFrame } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useRef, useEffect } from "react";
import { useControls } from "leva";

const LightBridgeMaterial = shaderMaterial(
  {
    uTime: 0,
    uBigWavesElevation: 0.05,
    uBigWavesFrequency: new THREE.Vector2(0.2, 0.1),
    uBigWavesSpeed: 0.2,
    uDepthColor: new THREE.Color("#00D0FF"),
    uSurfaceColor: new THREE.Color("#00D0FF"),
    uColorOffset: 0.05,
    uColorMultiplier: 8.0,
    uBrightness: 0.8,
  },
  lightBridgeVertexShader,
  lightBridgeFragmentShader
);

extend({ LightBridgeMaterial });

const LightBridge = () => {
  const lightBridgeMaterial = useRef();
  // const {
  //   uDepthColor,
  //   uSurfaceColor,
  //   uColorOffset,
  //   uColorMultiplier,
  //   uBigWavesElevation,
  //   uBigWavesSpeed,
  //   uBigWavesFrequency,
  // } = useControls({
  //   uDepthColor: "#000000",
  //   uSurfaceColor: "#30007c",
  //   uColorOffset: 0.05,
  //   uColorMultiplier: 8.0,
  //   uBigWavesElevation: 0.05,
  //   uBigWavesSpeed: 0.7,
  //   uBigWavesFrequency: { x: 0.2, y: 0.1 },
  // });

  // Update the material properties
  // useEffect(() => {
  //   if (lightBridgeMaterial.current) {
  //     lightBridgeMaterial.current.uDepthColor = new THREE.Color(uDepthColor);
  //     lightBridgeMaterial.current.uSurfaceColor = new THREE.Color(
  //       uSurfaceColor
  //     );
  //     lightBridgeMaterial.current.uColorOffset = uColorOffset;
  //     lightBridgeMaterial.current.uColorMultiplier = uColorMultiplier;
  //     lightBridgeMaterial.current.uBigWavesElevation = uBigWavesElevation;
  //     lightBridgeMaterial.current.uBigWavesSpeed = uBigWavesSpeed;
  //     lightBridgeMaterial.current.uBigWavesFrequency = new THREE.Vector2(
  //       uBigWavesFrequency.x,
  //       uBigWavesFrequency.y
  //     );
  //   }
  // }, [
  //   uDepthColor,
  //   uSurfaceColor,
  //   uColorOffset,
  //   uColorMultiplier,
  //   uBigWavesElevation,
  //   uBigWavesSpeed,
  //   uBigWavesFrequency,
  // ]);

  useFrame((state, delta) => {
    lightBridgeMaterial.current.uTime += delta;
  });
  return (
    <>
      <mesh receiveShadow rotation-x={-Math.PI / 2} position-y={-2.0}>
        <boxGeometry args={[3000, 3000, 0.1, 256, 256]} />
        <lightBridgeMaterial ref={lightBridgeMaterial} />
      </mesh>
    </>
  );
};

export default LightBridge;
