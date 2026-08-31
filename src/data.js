export const demoStore = {
  id: 'demo', slug: 'marmitaria-da-fatima', published: true, globalPrice: 24.9, priceType: 'global',
  navbar: { logoUrl: '/default-logo.svg', brand: 'Marmitaria da Fátima', hours: 'Aberto hoje · 10h às 14h', deliveryInfo: 'Entrega na região central · taxa a partir de R$ 4', links: { cardapio: true, sobre: true, pedidos: true, instagramUrl: '' } },
  hero: { imageUrl: '/default-hero.svg', message: 'Cardápio do dia feito com carinho. Peça pelo WhatsApp e receba em {local}.', deliveryLocation: 'sua casa', whatsappNumber: '5511999999999' },
  about: { description: 'Comida caseira, preparada todos os dias com ingredientes frescos e muito carinho.', location: 'Rua das Flores, 123 · Centro', businessHours: 'Segunda a sábado, 10h às 14h', contact: '(11) 99999-9999' }, pricingPlan: 'basic'
};
export const demoItems = [
  { id: '1', name: 'Frango grelhado', description: 'Arroz, feijão, salada e legumes da estação.', imageUrl: '/default-food.svg', likesCount: 18, order: 1 },
  { id: '2', name: 'Carne de panela', description: 'Cozida lentamente, com arroz, feijão e farofa.', imageUrl: '/default-food.svg', likesCount: 27, order: 2 },
  { id: '3', name: 'Opção vegetariana', description: 'Abóbora assada, grão-de-bico e arroz integral.', imageUrl: '/default-food.svg', likesCount: 11, order: 3 },
];
export const emptyStore = (ownerId = '') => ({ ...demoStore, id: undefined, ownerId, slug: '', published: false, navbar: { ...demoStore.navbar, brand: '' }, hero: { ...demoStore.hero }, about: { ...demoStore.about, description: '', location: '', businessHours: '', contact: '' } });
