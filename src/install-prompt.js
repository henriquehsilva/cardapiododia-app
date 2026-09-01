const installationId = location.pathname.match(/^\/loja\/([^/]+)/)?.[1] || 'principal';
const storageKey = `cdd-install-prompt-seen:${installationId}`;
const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
let deferredPrompt;

const hasSeenPrompt = () => { try { return localStorage.getItem(storageKey) === 'true'; } catch { return false; } };
const rememberPrompt = () => { try { localStorage.setItem(storageKey, 'true'); } catch {} };
const safe = value => String(value || '').replace(/[&<>"']/g, character => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[character]));

const removePrompt = () => document.querySelector('.install-app-prompt')?.remove();
const showPrompt = async mode => {
  if (isStandalone || hasSeenPrompt() || document.querySelector('.install-app-prompt')) return;
  let appName = 'Cardápio do Dia';
  let appIcon = '/cardapiododia-app-logo.png';
  try {
    const manifestUrl = document.querySelector('link[rel="manifest"]')?.href;
    const manifest = manifestUrl ? await fetch(manifestUrl).then(response => response.ok ? response.json() : null) : null;
    appName = manifest?.name || appName;
    appIcon = manifest?.icons?.[0]?.src || appIcon;
  } catch {}
  if (isStandalone || hasSeenPrompt() || document.querySelector('.install-app-prompt')) return;
  const prompt = document.createElement('aside');
  prompt.className = 'install-app-prompt';
  prompt.setAttribute('aria-label', `Instalar aplicativo ${appName}`);
  prompt.innerHTML = `<img src="${safe(appIcon)}" alt=""><div><strong>Instale ${safe(appName)}</strong><span>${mode === 'ios' ? 'Toque em Compartilhar e depois em “Adicionar à Tela de Início”.' : 'Acesse esta loja mais rápido, direto da tela inicial.'}</span></div><button class="install-app-action" type="button">${mode === 'ios' ? 'Entendi' : 'Instalar'}</button><button class="install-app-close" type="button" aria-label="Agora não">×</button>`;
  document.body.appendChild(prompt);
  prompt.querySelector('.install-app-close').onclick = () => { rememberPrompt(); removePrompt(); };
  prompt.querySelector('.install-app-action').onclick = async () => {
    if (mode === 'ios') { rememberPrompt(); removePrompt(); return; }
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    rememberPrompt();
    removePrompt();
  };
};

window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault();
  deferredPrompt = event;
  showPrompt('native');
});

window.addEventListener('appinstalled', () => { rememberPrompt(); removePrompt(); });
if (isIos && !isStandalone) window.addEventListener('DOMContentLoaded', () => showPrompt('ios'));
