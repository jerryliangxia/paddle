import { useRef, useState } from "react";
import { useGame } from "../stores/useGame";
import { bw, bh } from "../Constants";

export default function Overlay() {
  const dpadRef = useRef();
  const shiftButtonRef = useRef(null);
  const [isTouched, setIsTouched] = useState(false);
  const [isJumpButtonTouched, setIsJumpButtonTouched] = useState(false);
  const { setControlsMobile, resetControlsMobile } = useGame();

  const handleShiftTouchStart = (event) => {
    setIsJumpButtonTouched(true);
    setControlsMobile("shiftPressed", true);
  };

  const handleShiftTouchEnd = (event) => {
    setIsJumpButtonTouched(false);
    setControlsMobile("shiftPressed", false);
  };

  const handleTouchMove = (event) => {
    if (!dpadRef.current) return;

    const dpadRect = dpadRef.current.getBoundingClientRect();
    const dpadCenter = {
      x: dpadRect.left + dpadRect.width / 2,
      y: dpadRect.top + dpadRect.height / 2,
    };

    const touchPos = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
    };

    const dx = touchPos.x - dpadCenter.x;
    const dy = touchPos.y - dpadCenter.y;

    resetControlsMobile();

    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) {
        setControlsMobile("rightPressed", true);
      } else {
        setControlsMobile("leftPressed", true);
      }
    } else {
      if (dy > 0) {
        setControlsMobile("downPressed", true);
      } else {
        setControlsMobile("upPressed", true);
      }
    }
  };

  const buttonOpacity = (isButtonTouched) =>
    isButtonTouched || isTouched ? 0.5 : 0;

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div
        ref={dpadRef}
        id="controls"
        style={{
          position: "fixed",
          left: "1vw",
          bottom: "1vh",
          zIndex: 3,
          opacity: isTouched ? 0.5 : 0,
          transition: "opacity 0.25s ease-in-out",
          width: bw,
          height: bh,
        }}
        onTouchStart={(event) => {
          setIsTouched(true);
        }}
        onTouchMove={handleTouchMove}
        onTouchEnd={(event) => {
          resetControlsMobile();
          setIsTouched(false);
        }}
      >
        <div
          style={{
            background: "black",
            width: "100%",
            height: "100%",
            borderRadius: "8px",
          }}
        ></div>
      </div>
      <div
        ref={shiftButtonRef}
        id="shiftButton"
        onTouchStart={handleShiftTouchStart}
        onTouchEnd={handleShiftTouchEnd}
        style={{
          position: "fixed",
          right: "1vw",
          bottom: "1vh",
          zIndex: 3,
          opacity: buttonOpacity(isJumpButtonTouched),
          transition: "opacity 0.25s ease-in-out",
          width: bw / 2,
          height: bh / 2,
          backgroundColor: "#000",
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "1.5rem",
          color: "#FFF",
          userSelect: "none",
        }}
      >
        Boost
      </div>
    </div>
  );
}
