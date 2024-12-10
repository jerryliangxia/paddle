import lightBridgeVertexShader from "./light-bridge/vertex.glsl";
import lightBridgeFragmentShader from "./light-bridge/fragment.glsl";
import { extend, useFrame } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useRef } from "react";
import { useControls } from "leva";

const LightBridgeMaterial = shaderMaterial(
  {
    uTime: 0,
    uBigWavesElevation: 0.05,
    uBigWavesFrequency: new THREE.Vector2(0.2, 0.1),
    uBigWavesSpeed: 0.2,
    uDepthColor: new THREE.Color("#00D0FF"),
    uSurfaceColor: new THREE.Color("#BDE1EA"),
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

  // const { scaleX, scaleY, scaleZ, positionX, positionY, positionZ } =
  //   useControls({
  //     scaleX: { value: 0.7, min: 0.1, max: 10 },
  //     scaleY: { value: 1.5, min: 0.1, max: 10 },
  //     scaleZ: { value: 0.2, min: 0.1, max: 10 },
  //     positionX: { value: -62.8, min: -100, max: -20 },
  //     positionY: { value: 14.24, min: 14, max: 16 },
  //     positionZ: { value: -58.3, min: -60, max: -50 },
  //   });

  // useFrame((state, delta) => {
  //   lightBridgeMaterial.current.uTime += delta;
  // });

  return (
    <>
      <mesh
        rotation-x={-Math.PI / 2}
        position-x={-62.8}
        position-y={14.24}
        position-z={-58.3}
        scale={[0.7, 1.5, 0.2]}
      >
        <boxGeometry args={[15, 7.5, 1.0, 256, 256]} />
        <lightBridgeMaterial ref={lightBridgeMaterial} />
      </mesh>
    </>
  );
};

export default LightBridge;
