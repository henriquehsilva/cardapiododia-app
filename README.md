# Cardápio do Dia

Construtor mobile-first para negócios de delivery. O dono monta a loja no painel e publica em `/loja/:slug`; pedidos são enviados ao WhatsApp.

## Rodar localmente

```bash
cp .env.example .env
npm install
npm run dev
```

Sem variáveis Firebase, o projeto funciona em modo demonstração: crie uma conta com qualquer e-mail e senha, publique a loja e abra o link exibido no painel. A vitrine de exemplo também está em `/loja/marmitaria-da-fatima`.

## Firebase

1. Crie um projeto Firebase e habilite Authentication (e-mail/senha e Google), Firestore e Storage.
2. Preencha as chaves `VITE_FIREBASE_*` em `.env` (e no painel da Netlify).
3. Publique [firestore.rules](./firestore.rules) no Firestore. O upload para Storage está intencionalmente desativado nesta fase; a vitrine usa imagens padrão.

Os documentos seguem `users/{uid}`, `stores/{storeId}`, `stores/{storeId}/menuItems/{itemId}` e a subcoleção de curtidas `likes/{deviceId}`. A regra de contador permite apenas um incremento público de `likesCount`; a criação imutável do documento do dispositivo impede repetição no mesmo navegador.

## Plano Pro e Stripe

O botão **Quero o Pro** abre um modal que coleta dados de pessoa física ou empresa (incluindo CPF/CNPJ e endereço). O cartão nunca passa pelo React: a Netlify Function `create-checkout-session` cria uma sessão Stripe Checkout e redireciona para o Stripe hospedar o pagamento. Configure `STRIPE_SECRET_KEY` e `STRIPE_PRO_PRICE_ID` como variáveis de ambiente da Netlify; não coloque a chave secreta no frontend. A função usa `tax_id_collection` para empresas, conforme a documentação do Stripe.

## Deploy

O [netlify.toml](./netlify.toml) configura `npm run build`, publica `dist` e redireciona qualquer rota para `index.html`, preservando refreshs em `/loja/:slug` e `/admin/*`.
