import { create } from 'zustand';

interface PwaState {
  deferredPrompt: any;
  isInstallable: boolean;
  isInstalled: boolean;
  isModalOpen: boolean;
  setDeferredPrompt: (prompt: any) => void;
  setModalOpen: (isOpen: boolean) => void;
  detectPwaStatus: () => void;
  triggerInstall: () => void;
}

export const usePwaStore = create<PwaState>((set, get) => ({
  deferredPrompt: null,
  isInstallable: false,
  isInstalled: false,
  isModalOpen: false,

  setDeferredPrompt: (prompt) => {
    set({
      deferredPrompt: prompt,
      isInstallable: !!prompt
    });
  },

  setModalOpen: (isOpen) => {
    set({ isModalOpen: isOpen });
  },

  detectPwaStatus: () => {
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone === true;
    
    set({ isInstalled: isStandalone });
  },

  triggerInstall: () => {
    const promptEvent = get().deferredPrompt || (window as any).deferredPWAInstallPrompt;

    if (!promptEvent) {
      console.warn('⚠️ No active PWA install prompt available.');
      return;
    }

    // Trigger the prompt event
    promptEvent.prompt();

    // Wait for the user to respond to the prompt
    promptEvent.userChoice.then((choiceResult: { outcome: string }) => {
      console.log(`👤 User choice outcome: ${choiceResult.outcome}`);
      if (choiceResult.outcome === 'accepted') {
        set({ isInstalled: true, isInstallable: false, deferredPrompt: null });
        (window as any).deferredPWAInstallPrompt = null;
      }
    });
  }
}));
