import React from "react";
import { useThree } from "@react-three/fiber";

export default function Lights() {
  const { scene } = useThree();

  // React.useEffect(() => {
  //   // Hemisphere Light
  //   const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
  //   hemiLight.color.setHSL(0.6, 0.75, 0.5);
  //   hemiLight.groundColor.setHSL(0.095, 0.5, 0.5);
  //   hemiLight.position.set(0, 500, 0);
  //   scene.add(hemiLight);

  //   // Directional Light
  //   const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  //   dirLight.position.set(-1, 0.75, 1);
  //   dirLight.position.multiplyScalar(50);
  //   dirLight.name = 'dirlight';
  //   dirLight.castShadow = true;
  //   dirLight.shadow.mapSize.width = dirLight.shadow.mapSize.height = 1024 * 2;

  //   const d = 300;
  //   dirLight.shadow.camera.left = -d;
  //   dirLight.shadow.camera.right = d;
  //   dirLight.shadow.camera.top = d;
  //   dirLight.shadow.camera.bottom = -d;
  //   dirLight.shadow.camera.far = 3500;
  //   dirLight.shadow.bias = -0.0001;
  //   dirLight.shadow.darkness = 0.35;

  //   scene.add(dirLight);

  //   return () => {
  //     scene.remove(hemiLight);
  //     scene.remove(dirLight);
  //   };
  // }, [scene]);

  return (
    <>
      <ambientLight intensity={1.0} />
      <hemisphereLight
        skyColor={"red"}
        groundColor={"red"}
        intensity={2}
        position={[0, 100, 0]}
      />
      <directionalLight
        color={"red"}
        intensity={0.1}
        position={[-50, 37.5, 50]}
        // castShadow
        // shadow-mapSize-width={2048}
        // shadow-mapSize-height={2048}
        // shadow-camera-left={-300}
        // shadow-camera-right={300}
        // shadow-camera-top={300}
        // shadow-camera-bottom={-300}
        // shadow-camera-far={3500}
        // shadow-bias={-0.0001}
        // shadow-darkness={0.35}
      />
    </>
  );
}
