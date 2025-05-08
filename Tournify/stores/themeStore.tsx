// themeStore.ts
import { create } from 'zustand';

type ThemeType = 'system' | 'light' | 'dark' | 'bw';

interface ThemeStore {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: 'system',
  setTheme: (theme) => set({ theme }),
}));

//** Theme switching was made with help from ChatGPT */