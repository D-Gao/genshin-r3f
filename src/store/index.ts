// store.ts
import { create } from "zustand";

// Define the shape of the state
export interface StoreState {
  diveIn: boolean;
  bgmStarted: boolean;
  doorCreated: boolean;
  doorOpened: boolean;
  count: number;
  isRunning: boolean;
  increment: () => void;
  reset: () => void;
  startBgm: () => void;
  toggleDoor: () => void;
  setRunning: (e: boolean) => void;
  setDiveIn: () => void;
  setDoorOpen: () => void;
}

// Create the Zustand store with types
const useStore = create<StoreState>((set) => ({
  doorOpened: false,
  diveIn: false,
  bgmStarted: false,
  doorCreated: false,
  count: 0,
  isRunning: true,
  increment: () => set((state) => ({ count: state.count + 1 })),
  reset: () => set({ count: 0 }),
  startBgm: () => set(() => ({ bgmStarted: true })),
  toggleDoor: () => set((state) => ({ doorCreated: !state.doorCreated })),
  setRunning: (e: boolean) => set(() => ({ isRunning: e })),
  setDiveIn: () => set(() => ({ diveIn: true })),
  setDoorOpen: () => set(() => ({ doorOpened: true })),
}));

export default useStore;
