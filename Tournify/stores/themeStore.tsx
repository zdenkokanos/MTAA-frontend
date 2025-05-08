import { create } from 'zustand';
import { lightTheme, darkTheme, blackWhiteTheme } from '@/themes/theme';

type ThemeType = 'light' | 'dark' | 'bw';

interface ThemeStore {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  getThemeObject: () => typeof lightTheme;
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  theme: 'light',
  setTheme: (theme) => set({ theme }),
  getThemeObject: () => {
    const current = get().theme;
    if (current === 'dark') return darkTheme;
    if (current === 'bw') return blackWhiteTheme;
    return lightTheme;
  },
}));