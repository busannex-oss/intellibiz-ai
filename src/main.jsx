import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'
import './globals.css'

// Register PWA service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        // Check for updates every 60s
        setInterval(() => reg.update(), 60 * 1000);
      })
      .catch(() => {});
  });
}

// Install prompt for PWA
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  window.dispatchEvent(new Event('pwa-installable'));
});

window.addEventListener('appinstalled', () => {
  deferredPrompt = null;
  window.dispatchEvent(new Event('pwa-installed'));
});

window.installApp = async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
  }
};

// Online/offline status events
window.addEventListener('online', () =>
  window.dispatchEvent(new Event('app-online'))
);
window.addEventListener('offline', () =>
  window.dispatchEvent(new Event('app-offline'))
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)