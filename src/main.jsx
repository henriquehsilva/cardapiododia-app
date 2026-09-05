import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '@material/web/button/filled-button.js';
import '@material/web/button/outlined-button.js';
import '@material/web/textfield/filled-text-field.js';
import '@material/web/checkbox/checkbox.js';
import '@material/web/progress/circular-progress.js';
import '@material/web/iconbutton/icon-button.js';
import './styles.css';
import './order-modal.js';
import './gallery-modal.js';
import './install-prompt.js';
import App from './App.jsx';

const storeSlug = location.pathname.match(/^\/loja\/([^/]+)/)?.[1];
if (location.pathname === '/lojas') document.querySelector('link[rel="manifest"]')?.setAttribute('href', '/marketplace.webmanifest');
else if (storeSlug) document.querySelector('link[rel="manifest"]')?.setAttribute('href', `/.netlify/functions/store-manifest?slug=${encodeURIComponent(storeSlug)}`);
createRoot(document.getElementById('root')).render(<BrowserRouter><App /></BrowserRouter>);

if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
