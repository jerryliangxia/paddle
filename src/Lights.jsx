import RectAreaLightModels from "./components/RectAreaLightModels.jsx";

export default function Lights() {
  return (
    <>
      <rectAreaLight
        position={[-100, 75, -100]}
        rotation={[-2.0, -0.7, 0]}
        width={100}
        height={100}
        intensity={50}
        // color="#FFEBC5"
      />
      <ambientLight intensity={1.5} />
    </>
  );
}
