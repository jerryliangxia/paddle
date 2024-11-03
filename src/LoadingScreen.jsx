import { useProgress } from "@react-three/drei";
import { useGame } from "./stores/useGame";

export const LoadingScreen = ({ started, onStarted, useOctree }) => {
  const { progress } = useProgress();
  const { desktopControl, setDesktopControl } = useGame();
  const { setMap } = useGame();
  const { deviceType } = useGame();

  const enter = () => {
    onStarted();
    document.requestPointerLock();
    // Click on the canvas after 0.1 seconds
    setTimeout(() => {
      document.getElementById("canvas").click();
    }, 100);
    setTimeout(() => {
      document.getElementById("canvas").click();
    }, 100);
  };

  return (
    <div
      id="fullscreen-control-container"
      className={`loadingScreen ${started ? "loadingScreen--started" : ""}`}
    >
      <div className="loadingScreen__progress">
        <div
          className="loadingScreen__progress__value"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>
      <div className="loadingScreen__board">
        <h1 className="loadingScreen__title">Paddle</h1>
        <button
          className="loadingScreen__button"
          disabled={progress < 100}
          onClick={enter}
          onTouchStart={onStarted}
        >
          Begin
        </button>
        {deviceType === 1 && !useOctree && (
          <button
            className="loadingScreen__toggleControl"
            onTouchStart={() => setDesktopControl(!desktopControl)}
          >
            {desktopControl ? "Standard" : "Simple"}
          </button>
        )}
        <div className="loadingScreen__circles">
          <div
            className="loadingScreen__circle"
            style={{ backgroundColor: "#91B76F" }}
            onClick={(e) => {
              e.stopPropagation();
              setMap(0);
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
              setMap(0);
            }}
          />
          <div
            className="loadingScreen__circle"
            style={{ backgroundColor: "#88B3D6" }}
            onClick={(e) => {
              e.stopPropagation();
              setMap(1);
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
              setMap(1);
            }}
          />
        </div>
      </div>
      <img
        className="controlKeys"
        src="./img/tutorial.png"
        alt="control keys"
      />
    </div>
  );
};
