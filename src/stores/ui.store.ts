import { create } from 'zustand';

interface UIState {
  theme: 'dark' | 'light';
  isSidebarCollapsed: boolean;
  isCommandPaletteOpen: boolean;
  isProfileModalOpen: boolean;

  toggleTheme: () => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setProfileModalOpen: (open: boolean) => void;
}

// System is dark mode only. Ensure dark mode classes are always set on startup
if (typeof window !== 'undefined') {
  document.documentElement.classList.add('dark');
  document.documentElement.classList.remove('light');
}

export const useUIStore = create<UIState>((set) => ({
  theme: 'dark',
  isSidebarCollapsed: false,
  isCommandPaletteOpen: false,
  isProfileModalOpen: false,

  toggleTheme: () => {
    // No-op: Dark mode only
  },

  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),
  setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
  setProfileModalOpen: (open) => set({ isProfileModalOpen: open }),
}));
