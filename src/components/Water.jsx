import { Water } from "three/addons/objects/Water2.js";
import * as THREE from "three";

export default function Water2() {
  const waterGeometry = new THREE.PlaneGeometry(400, 400);
  const loader = new THREE.TextureLoader();

  const water = new Water(waterGeometry, {
    color: 0xc5f1ff,
    scale: 100,
    flowDirection: new THREE.Vector2(0.01, 0.01),
    textureWidth: 1024,
    textureHeight: 1024,
    normalMap0: loader.load(
      "https://threejs.org/examples/textures/water/Water_1_M_Normal.jpg"
    ),
    normalMap1: loader.load(
      "https://threejs.org/examples/textures/water/Water_2_M_Normal.jpg"
    ),
  });

  return (
    <mesh rotation-x={-Math.PI / 2}>
      <primitive object={water} />
    </mesh>
  );
}
