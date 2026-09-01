const storageKey = 'cdd-install-prompt-seen';
const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
let deferredPrompt;

const hasSeenPrompt = () => { try { return localStorage.getItem(storageKey) === 'true'; } catch { return false; } };
const rememberPrompt = () => { try { localStorage.setItem(storageKey, 'true'); } catch {} };

const removePrompt = () => document.querySelector('.install-app-prompt')?.remove();
const showPrompt = mode => {
  if (isStandalone || hasSeenPrompt() || document.querySelector('.install-app-prompt')) return;
  const prompt = document.createElement('aside');
  prompt.className = 'install-app-prompt';
  prompt.setAttribute('aria-label', 'Instalar aplicativo Cardápio do Dia');
  prompt.innerHTML = `<img src="/cardapiododia-app-logo.png" alt=""><div><strong>Instale o Cardápio do Dia</strong><span>${mode === 'ios' ? 'Toque em Compartilhar e depois em “Adicionar à Tela de Início”.' : 'Acesse sua loja mais rápido, direto da tela inicial.'}</span></div><button class="install-app-action" type="button">${mode === 'ios' ? 'Entendi' : 'Instalar'}</button><button class="install-app-close" type="button" aria-label="Agora não">×</button>`;
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
