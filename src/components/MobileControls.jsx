import { useRef, useState, useEffect } from "react";
import { useGame } from "../stores/useGame";
import { bw } from "../Constants";

export default function Overlay() {
  const dpadRef = useRef();
  const [isTouched, setIsTouched] = useState(false);
  const [touchPosition, setTouchPosition] = useState({ x: 0, y: 0 });
  const { setControlsMobile, resetControlsMobile } = useGame();

  const handleTouchMove = (event) => {
    event.stopPropagation();
    if (!dpadRef.current) return;

    const dpadRect = dpadRef.current.getBoundingClientRect();
    const dpadCenter = {
      x: dpadRect.left + dpadRect.width / 2,
      y: dpadRect.top + dpadRect.height / 2,
    };

    const touchPos = {
      x: event.touches[0].clientX - dpadCenter.x,
      y: event.touches[0].clientY - dpadCenter.y,
    };

    const radius = dpadRect.width / 2;
    const distance = Math.sqrt(touchPos.x ** 2 + touchPos.y ** 2);
    const angle = Math.atan2(touchPos.y, touchPos.x);

    const clampedDistance = Math.min(distance, radius);
    const clampedX = clampedDistance * Math.cos(angle);
    const clampedY = clampedDistance * Math.sin(angle);

    setTouchPosition({ x: clampedX, y: clampedY });

    const direction = (angle + Math.PI * 2) % (Math.PI * 2);
    resetControlsMobile();

    if (direction < Math.PI / 4 || direction > (Math.PI * 7) / 4) {
      setControlsMobile("rightPressed", true);
    } else if (direction < (Math.PI * 3) / 4) {
      setControlsMobile("downPressed", true);
    } else if (direction < (Math.PI * 5) / 4) {
      setControlsMobile("leftPressed", true);
    } else if (direction < (Math.PI * 7) / 4) {
      setControlsMobile("upPressed", true);
    }

    // if (distance > radius * 0.9) {
    //   setControlsMobile("shiftPressed", true);
    // } else {
    //   setControlsMobile("shiftPressed", false);
    // }
  };

  useEffect(() => {
    let animationFrameId;
    const lerpTouchPosition = () => {
      setTouchPosition((prev) => ({
        x: prev.x * 0.8,
        y: prev.y * 0.8,
      }));
      animationFrameId = requestAnimationFrame(lerpTouchPosition);
    };

    if (!isTouched) {
      lerpTouchPosition();
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [isTouched]);

  useEffect(() => {
    const dpad = dpadRef.current;

    if (dpad) {
      const options = { passive: false };

      const handleTouchStart = (event) => {
        event.preventDefault();
        setIsTouched(true);
        handleTouchMove(event);
      };

      const handleTouchEnd = (event) => {
        event.preventDefault();
        resetControlsMobile();
        setIsTouched(false);
      };

      dpad.addEventListener("touchstart", handleTouchStart, options);
      dpad.addEventListener("touchmove", handleTouchMove, options);
      dpad.addEventListener("touchend", handleTouchEnd, options);

      return () => {
        dpad.removeEventListener("touchstart", handleTouchStart);
        dpad.removeEventListener("touchmove", handleTouchMove);
        dpad.removeEventListener("touchend", handleTouchEnd);
      };
    }
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div
        ref={dpadRef}
        id="controls"
        style={{
          position: "fixed",
          left: "1vh",
          bottom: "1vh",
          zIndex: 3,
          opacity: isTouched ? 0.5 : 0,
          transition: "opacity 0.5s ease-in-out",
          width: bw * 0.9,
          height: bw * 0.9,
          borderRadius: "50%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: `calc(50% + ${touchPosition.x}px)`,
            top: `calc(50% + ${touchPosition.y}px)`,
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            border: "2px solid white",
            transform: "translate(-50%, -50%)",
            opacity: isTouched ? 1 : 0,
            transition: "opacity 0.5s ease-in-out",
          }}
        />
      </div>
    </div>
  );
}
