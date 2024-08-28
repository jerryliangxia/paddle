import skyVertexShader from "./sky/skyVertexShader.js";
import skyFragmentShader from "./sky/skyFragmentShader.js";
import { useRef } from "react";
import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";
import { extend } from "@react-three/fiber";

const SphereSky = () => {
  const SkyMaterial = shaderMaterial(
    {
      uTexture: new THREE.TextureLoader().load("/img/ivorysky.png"),
    },
    skyVertexShader,
    skyFragmentShader
  );
  extend({ SkyMaterial });

  const skyMaterial = useRef();

  return (
    <mesh>
      <sphereGeometry args={[700, 256, 256]} />
      <skyMaterial ref={skyMaterial} side={THREE.BackSide} />
    </mesh>
  );
};

export default SphereSky;
