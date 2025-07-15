import { useState, useEffect } from 'react';

export const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const checkIfInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isInWebAppiOS = window.navigator.standalone === true;
      const isInstalled = isStandalone || isInWebAppiOS;
      
      setIsInstalled(isInstalled);
      
      // If app is already installed, don't show install button
      if (isInstalled) {
        setIsInstallable(false);
        setDeferredPrompt(null);
      }
      
      return isInstalled;
    };

    // Initial check
    const installed = checkIfInstalled();
    
    // Only listen for install prompt if not already installed
    if (!installed) {
      // Listen for the beforeinstallprompt event
      const handleBeforeInstallPrompt = (e) => {
        console.log('💡 PWA install prompt available');
        e.preventDefault();
        setDeferredPrompt(e);
        setIsInstallable(true);
      };

      // Listen for the appinstalled event
      const handleAppInstalled = () => {
        console.log('✅ PWA installed successfully');
        setIsInstalled(true);
        setIsInstallable(false);
        setDeferredPrompt(null);
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.addEventListener('appinstalled', handleAppInstalled);

      // Also listen for display mode changes
      const mediaQuery = window.matchMedia('(display-mode: standalone)');
      const handleDisplayModeChange = () => {
        checkIfInstalled();
      };
      
      mediaQuery.addEventListener('change', handleDisplayModeChange);

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('appinstalled', handleAppInstalled);
        mediaQuery.removeEventListener('change', handleDisplayModeChange);
      };
    }
  }, []);

  const installPWA = async () => {
    if (!deferredPrompt) {
      console.log('⚠️ No install prompt available');
      return false;
    }

    try {
      // Show the install prompt
      deferredPrompt.prompt();
      
      // Wait for the user to respond
      const { outcome } = await deferredPrompt.userChoice;
      
      console.log(`👤 User response: ${outcome}`);
      
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setIsInstallable(false);
      }
      
      // Clean up
      setDeferredPrompt(null);
      
      return outcome === 'accepted';
    } catch (error) {
      console.error('❌ Error during PWA install:', error);
      return false;
    }
  };

  return {
    isInstallable: isInstallable && !isInstalled,
    isInstalled,
    installPWA
  };
}; 