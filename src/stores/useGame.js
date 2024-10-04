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
    };
  })
);
