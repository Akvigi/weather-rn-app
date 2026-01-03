import { create } from 'zustand';

interface AppStoreState {
  // Define your state properties and methods here
  // count: number;
  // increase: () => void;
  // decrease:  () => void;
  // reset:  () => void;
}
// Define the store
// can be persisted with persist()
const useAppStore = create<AppStoreState>(_set => ({
  // count: 0,
  // increase: () => set(state => ({ count: state.count + 1 })),
  // decrease: () => set(state => ({ count: state.count - 1 })),
  // reset: () => set({ count: 0 }),
}));

export default useAppStore;
