import { create } from "zustand";

export const useThemeStore = create((setterFn) => ({
  theme: localStorage.getItem("chat-theme") || "lofi",
  setTheme: (theme) => {
    localStorage.setItem("chat-theme", theme);
    setterFn({ theme });
  },
}));
