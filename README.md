# Cardápio do Dia

Construtor mobile-first para negócios de alimentação. O lojista monta e publica o cardápio em `/loja/:slug`, recebe pedidos por WhatsApp, Pix, Stripe ou pagamento à vista na entrega e acompanha tudo no painel.

## Rodar localmente

```bash
cp .env.example .env
npm install
npm run dev
```

Use `npm test` para executar os testes de domínio e `npm run build` para validar a versão de produção.

Sem variáveis Firebase, o projeto funciona em modo demonstração: crie uma conta com qualquer e-mail e senha, publique a loja e abra o link exibido no painel. A vitrine de exemplo também está em `/loja/marmitaria-da-fatima`.

## Firebase

1. Crie um projeto Firebase e habilite Authentication (e-mail/senha e Google), Firestore e Storage.
2. Preencha as chaves `VITE_FIREBASE_*` em `.env` (e no painel da Netlify).
3. Publique [firestore.rules](./firestore.rules) e [storage.rules](./storage.rules).
4. Para pedidos, comentários, SEO e imagens sociais, configure `FIREBASE_SERVICE_ACCOUNT_BASE64` somente na Netlify.

Os documentos seguem `users/{uid}`, `stores/{storeId}`, `stores/{storeId}/menuItems/{itemId}` e a subcoleção de curtidas `likes/{deviceId}`. A regra de contador permite apenas um incremento público de `likesCount`; a criação imutável do documento do dispositivo impede repetição no mesmo navegador.

## Pagamentos e Stripe

O botão **Quero o Pro** continua usando Stripe Checkout para a assinatura da plataforma. Cada restaurante também pode conectar uma conta Stripe Express para receber pagamentos à vista diretamente. Configure `STRIPE_SECRET_KEY`, `STRIPE_PRO_PRICE_ID`, `STRIPE_CONNECT_WEBHOOK_SECRET` e `APP_URL` somente na Netlify. O webhook deve apontar para `/.netlify/functions/stripe-connect-webhook` e ouvir `checkout.session.completed`.

## Deploy

O [netlify.toml](./netlify.toml) configura o SPA, sitemap, páginas de preview social e SEO dos restaurantes e pratos.
