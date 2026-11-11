import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

/** hi: đầy đủ hậu kỳ · lite: tiết kiệm GPU · classic: giao diện 2D. */
export type GraphicsMode = 'hi' | 'lite' | 'classic';

interface GraphicsState {
  mode: GraphicsMode;
  setMode: (mode: GraphicsMode) => void;
}

export const useGraphicsStore = create<GraphicsState>()(
  persist(
    (set) => ({
      mode: 'hi',
      setMode: (mode) => set({ mode }),
    }),
    { name: 'ai-automation-hub-graphics', storage: createJSONStorage(() => localStorage) },
  ),
);
