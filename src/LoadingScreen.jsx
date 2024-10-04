import { useProgress } from "@react-three/drei";

export const LoadingScreen = ({ started, onStarted }) => {
  const { progress } = useProgress();

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
    <div className={`loadingScreen ${started ? "loadingScreen--started" : ""}`}>
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
      </div>
    </div>
  );
};
