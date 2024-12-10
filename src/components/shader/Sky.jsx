import skyVertexShader from "./sky/vertex.glsl";
import skyFragmentShader from "./sky/fragment.glsl";
import { useRef } from "react";
import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";
import { extend } from "@react-three/fiber";

const Sky = () => {
  const SkyMaterial = shaderMaterial(
    {
      uTexture: new THREE.TextureLoader().load("img/sky.png"),
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

export default Sky;
