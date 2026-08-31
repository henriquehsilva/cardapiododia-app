# Repository Guidelines

## Project Structure & Module Organization

The frontend is a React 18 single-page application built with Vite. Application code lives in `src/`: `main.jsx` initializes React and routing, `App.jsx` contains the primary pages and editor workflow, `firebase.js` configures backend services, and `data.js` provides demo/default data. Shared styling is in `src/styles.css`; custom modal elements are in `src/order-modal.js` and `src/gallery-modal.js`. Static images belong in `public/`. The Stripe checkout backend is the Netlify function at `netlify/functions/create-checkout-session.js`. Firebase access policies live in `firestore.rules` and `storage.rules`.

## Build, Test, and Development Commands

- `npm install` installs the locked dependencies from `package-lock.json`.
- `npm run dev` starts the Vite development server with hot reload.
- `npm run build` creates the production bundle in `dist/`.
- `npm run preview` serves the production bundle locally for a final check.

There is currently no automated test or lint command. Before submitting changes, run `npm run build` and manually exercise the affected flows, including demo mode when Firebase credentials are unavailable.

## Coding Style & Naming Conventions

Use modern ES modules, React function components, and hooks. Match the existing style: two-space indentation, single quotes, semicolons, and concise JSX. Name components in `PascalCase`, functions and variables in `camelCase`, and CSS classes in kebab-case. Keep Firebase collection names aligned with the existing schema (`stores/{storeId}/menuItems/{itemId}`). Avoid broad formatting-only changes, especially in the large `src/App.jsx` file. No formatter is configured, so preserve nearby conventions.

## Testing Guidelines

For UI changes, verify `/`, `/admin/login`, the `/admin` editor, and `/loja/:slug` at relevant mobile and desktop widths. Test both saving and publishing, plus WhatsApp or Stripe handoffs when touched. If introducing tests, prefer Vitest with React Testing Library, place files beside their modules as `*.test.jsx`, and add the corresponding npm script.

## Commit & Pull Request Guidelines

Recent history uses brief imperative subjects (for example, `update pedido session`). Keep commits focused and use a clearer equivalent such as `fix checkout session validation`. Pull requests should explain the user-visible outcome, list manual verification steps, link related issues, and include screenshots or recordings for visual changes. Call out new environment variables, Firebase rule changes, or deployment configuration changes explicitly.

## Security & Configuration

Never commit `.env` files or secrets. Frontend Firebase settings must use `VITE_FIREBASE_*`; `STRIPE_SECRET_KEY` and `STRIPE_PRO_PRICE_ID` belong only in Netlify environment configuration. Review Firebase rules whenever changing stored document shapes or upload paths.
