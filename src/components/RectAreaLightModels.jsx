import { useHelper } from "@react-three/drei";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";
import { useControls } from "leva";
import { useRef } from "react";

const RectArealightWithHelper = ({
  width,
  height,
  intensity,
  rotation,
  position,
  color,
}) => {
  // This somehow changes the texture of the ground-plane and makes it more shiny? Very interesting
  RectAreaLightUniformsLib.init();
  const rectAreaLight = useRef();
  useHelper(rectAreaLight, RectAreaLightHelper);
  return (
    <rectAreaLight
      ref={rectAreaLight}
      position={position}
      width={width}
      height={height}
      color={color}
      intensity={intensity}
      rotation={rotation}
    />
  );
};

export default function RectAreaLightModels(props) {
  const { width, height, intensity, color } = useControls("Light Properties", {
    width: {
      value: 2.0,
      step: 0.1,
    },
    height: {
      value: 2.0,
      step: 0.1,
    },
    intensity: {
      value: 5.0,
      step: 0.1,
    },
    color: {
      value: "#ffffff",
    },
  });

  const { positionX, positionY, positionZ } = useControls("Light Position", {
    positionX: {
      value: 0,
      step: 0.1,
    },
    positionY: {
      value: 1.2,
      step: 0.1,
    },
    positionZ: {
      value: -0.8,
      step: 0.1,
    },
  });

  const { rotationX, rotationY, rotationZ } = useControls("Light Rotation", {
    rotationX: {
      value: -Math.PI,
      step: 0.01,
    },
    rotationY: {
      value: 0,
      step: 0.01,
    },
    rotationZ: {
      value: 0,
      step: 0.01,
    },
  });

  return (
    <>
      <RectArealightWithHelper
        position={props.position.map(
          (value, index) => value + [positionX, positionY, positionZ][index]
        )}
        rotation={[props.rotationX, props.rotationY, rotationZ]}
        width={props.width}
        height={props.height}
        intensity={props.intensity}
        color={props.color}
      />
    </>
  );
}
