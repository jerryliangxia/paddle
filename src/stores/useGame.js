import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export const useGame = create(
  subscribeWithSelector((set, get) => {
    return {
      // Canvas
      overlayVisible: false,
      setOverlayVisible: (visible) => {
        set(() => ({ overlayVisible: visible }));
      },

      // Device Type
      deviceType: 0,
      setDeviceType: (deviceType) => {
        set((state) => {
          return { ...state, deviceType: deviceType };
        });
      },

      // Desktop Controls
      desktopControl: true,
      setDesktopControl: (desktopControl) => {
        set((state) => ({ ...state, desktopControl: desktopControl }));
      },

      // Mobile Controls
      controlsMobile: {
        upPressed: false,
        downPressed: false,
        leftPressed: false,
        rightPressed: false,
        shiftPressed: false,
      },
      setControlsMobile: (control, value) =>
        set((state) => ({
          controlsMobile: {
            ...state.controlsMobile,
            [control]: value,
          },
        })),
      resetControlsMobile: () =>
        set((state) => ({
          controlsMobile: {
            upPressed: false,
            downPressed: false,
            leftPressed: false,
            rightPressed: false,
            shiftPressed: false,
          },
        })),

      // Map
      map: 0,
      setMap: (map) => {
        set((state) => {
          return { ...state, map: map };
        });
      },

      visibleSequences: 0,
      setVisibleSequences: (visibleSequences) => {
        set((state) => ({ ...state, visibleSequences: visibleSequences }));
      },

      completeGameVisible: false,
      setCompleteGameVisible: (completeGameVisible) => {
        set((state) => ({
          ...state,
          completeGameVisible: completeGameVisible,
        }));
      },

      resetGame: false,
      setResetGame: (resetGame) => {
        set((state) => ({ ...state, resetGame: resetGame }));
      },

      playAudio: true,
      setPlayAudio: (playAudio) => {
        set((state) => ({ ...state, playAudio: playAudio }));
      },
    };
  })
);
