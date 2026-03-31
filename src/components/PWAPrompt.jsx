import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Download, WifiOff } from 'lucide-react';

export default function PWAPrompt() {
  const [installable, setInstallable] = useState(false);
  const [offline, setOffline] = useState(!navigator.onLine);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const onInstallable = () => setInstallable(true);
    const onInstalled = () => setInstallable(false);
    const onOnline = () => setOffline(false);
    const onOffline = () => setOffline(true);

    window.addEventListener('pwa-installable', onInstallable);
    window.addEventListener('pwa-installed', onInstalled);
    window.addEventListener('app-online', onOnline);
    window.addEventListener('app-offline', onOffline);

    return () => {
      window.removeEventListener('pwa-installable', onInstallable);
      window.removeEventListener('pwa-installed', onInstalled);
      window.removeEventListener('app-online', onOnline);
      window.removeEventListener('app-offline', onOffline);
    };
  }, []);

  return (
    <>
      {/* Offline Banner */}
      {offline && (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-red-600 text-white text-center py-2 text-sm flex items-center justify-center gap-2">
          <WifiOff className="w-4 h-4" />
          You're offline. Some features may be limited.
        </div>
      )}

      {/* Install Banner */}
      {installable && !dismissed && (
        <div className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-80 z-[99] bg-slate-800 border border-amber-500/30 rounded-xl shadow-2xl p-4 flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0">
            <Download className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm">Install BrandForge</p>
            <p className="text-slate-400 text-xs mt-0.5">Add to your home screen for the best experience</p>
            <div className="flex gap-2 mt-3">
              <Button
                size="sm"
                className="bg-amber-500 hover:bg-amber-600 text-white text-xs h-7 px-3"
                onClick={() => { window.installApp(); setDismissed(true); }}
              >
                Install
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-slate-400 hover:text-white text-xs h-7 px-3"
                onClick={() => setDismissed(true)}
              >
                Not now
              </Button>
            </div>
          </div>
          <button onClick={() => setDismissed(true)} className="text-slate-500 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </>
  );
}