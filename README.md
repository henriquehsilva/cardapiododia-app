# Cardápio do Dia

Plataforma para restaurantes criarem um cardápio digital, receberem pedidos e acompanharem vendas. A vitrine aceita Pix, cartão à vista via Stripe Connect, pagamento na entrega e WhatsApp.

## Rodar localmente

```bash
cp .env.example .env
npm install
npm run dev
```

Sem variáveis Firebase, o projeto funciona em modo demonstração: crie uma conta com qualquer e-mail e senha, publique a loja e abra o link exibido no painel. A vitrine de exemplo também está em `/loja/marmitaria-da-fatima`.

Use `npm test` para executar os testes e `npm run build` para validar a versão de produção.

## Firebase

1. Crie um projeto Firebase e habilite Authentication (e-mail/senha e Google), Firestore e Storage.
2. Preencha as chaves `VITE_FIREBASE_*` em `.env` (e no painel da Netlify).
3. Publique [firestore.rules](./firestore.rules) e [storage.rules](./storage.rules).
4. Configure `FIREBASE_SERVICE_ACCOUNT_BASE64` na Netlify com o JSON da conta de serviço codificado em base64.

Os documentos seguem `stores/{storeId}`, `stores/{storeId}/menuItems/{itemId}` e `stores/{storeId}/orders/{orderId}`. Curtidas e comentários são gravados pelas funções do servidor.

## Pagamentos

O Pix é gerado no navegador e enviado diretamente à chave do restaurante. Para cartão, cada restaurante conecta uma conta Stripe Express; o checkout é criado dinamicamente e não oferece parcelamento. Configure o webhook `/.netlify/functions/stripe-connect-webhook` para `checkout.session.completed`.

`STRIPE_SECRET_KEY` e `STRIPE_PRO_PRICE_ID` também habilitam a assinatura mensal da plataforma. `APP_URL` deve conter a URL pública canônica, por exemplo `https://cardapiododia.app`.

## Deploy

O [netlify.toml](./netlify.toml) publica `dist/`, expõe as funções em `netlify/functions/` e configura SEO, sitemap, manifesto dinâmico e previews sociais.
