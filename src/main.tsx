import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/app/app';
import '@/styles/index.css';
import { usePwaStore } from '@/stores/pwa.store';

// Register PWA Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((reg) => console.log('🚀 PWA: Service Worker registered successfully:', reg.scope))
      .catch((err) => console.error('❌ PWA: Service Worker registration failed:', err));
  });
}

// Global PWA prompt listener
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  (window as any).deferredPWAInstallPrompt = e;
  usePwaStore.getState().setDeferredPrompt(e);
});

// Detect installed status
window.addEventListener('DOMContentLoaded', () => {
  usePwaStore.getState().detectPwaStatus();
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
