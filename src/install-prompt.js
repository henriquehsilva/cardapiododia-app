let deferredPrompt = null;

window.__cddInstallPrompt = null;
window.__cddWaitForInstallPrompt = () => Promise.resolve(deferredPrompt);

window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault();
  deferredPrompt = event;
  window.__cddInstallPrompt = event;
  window.dispatchEvent(new CustomEvent('cddinstallpromptready'));
});

window.addEventListener('appinstalled', () => {
  deferredPrompt = null;
  window.__cddInstallPrompt = null;
});
