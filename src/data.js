export const demoStore = {
  id: "demo",
  slug: "marmitaria-da-fatima",
  published: true,
  brand: "Marmitaria da Fátima",
  tagline: "Comida caseira feita com carinho todos os dias.",
  description: "Marmitas, pratos executivos, bebidas e sobremesas preparados diariamente.",
  heroImage: "/default-restaurant-hero.png",
  logoUrl: "",
  whatsapp: "5511999999999",
  instagram: "achadinhosdaana",
  address: "São Paulo · SP",
  city: "São Paulo",
  state: "SP",
  latitude: -23.5505,
  longitude: -46.6333,
  hours: "Seg–Sáb · 9h às 18h",
  palette: "sky",
  categories: [
    { id: "marmitas", name: "Marmitas" },
    { id: "executivos", name: "Executivos" },
    { id: "bebidas", name: "Bebidas" },
  ],
  payment: {
    enabled: true,
    pixKey: "11999999999",
    pixReceiverName: "ANA SILVA",
    pixCity: "SAO PAULO",
  },
};
export const demoProducts = [
  {
    id: "1",
    name: "Frango grelhado",
    category: "Marmitas",
    categoryId: "marmitas",
    description: "Arroz, feijão, salada e legumes da estação.",
    price: 24.9,
    cashbackPercent: 10,
    stock: 8,
    unavailable: false,
    imageUrl:
      "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "2",
    name: "Carne de panela",
    category: "Executivos",
    categoryId: "executivos",
    description: "Cozida lentamente, com arroz, feijão e farofa.",
    price: 27.9,
    stock: 5,
    unavailable: false,
    imageUrl:
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "3",
    name: "Suco natural",
    category: "Bebidas",
    categoryId: "bebidas",
    description: "Preparado na hora com frutas frescas.",
    price: 8.5,
    stock: 0,
    unavailable: true,
    imageUrl:
      "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=800&q=80",
  },
];

const marketplaceSamples = [
  ["sabor-da-vovo", "Sabor da Vovó", "Marmitas caseiras com aquele gostinho de casa.", "Marmitas", "Curitiba · PR", "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80", "terracotta"],
  ["burger-da-praca", "Burger da Praça", "Hambúrgueres artesanais e acompanhamentos crocantes.", "Lanches", "Goiânia · GO", "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80", "graphite"],
  ["doce-afeto", "Doce Afeto", "Doces artesanais para celebrar cada momento.", "Doces", "Recife · PE", "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?auto=format&fit=crop&w=900&q=80", "rose"],
  ["grao-cafe", "Grão Café", "Cafés especiais, salgados e bolos frescos.", "Cafeteria", "Belo Horizonte · MG", "https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=900&q=80", "terracotta"],
  ["verde-no-prato", "Verde no Prato", "Refeições vegetarianas leves e cheias de sabor.", "Vegetariano", "Rio de Janeiro · RJ", "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80", "sky"],
  ["cantina-da-nonna", "Cantina da Nonna", "Massas frescas e molhos preparados diariamente.", "Massas", "São Paulo · SP", "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=900&q=80", "rose"],
];

export const demoMarketplaceStores = marketplaceSamples.map(
  ([slug, brand, tagline, category, address, heroImage, palette], index) => ({
    ...demoStore,
    id: `market-${index + 1}`,
    slug,
    brand,
    tagline,
    description: tagline,
    address,
    heroImage,
    palette,
    categories: [{ id: category.toLowerCase(), name: category }],
    city: address.split(" · ")[0],
    state: address.split(" · ")[1],
  }),
);
export const emptyStore = (uid) => ({
  ...demoStore,
  id: undefined,
  slug: "",
  brand: "",
  ownerId: uid,
  published: false,
  categories: [],
  payment: { enabled: false, pixKey: "", pixReceiverName: "", pixCity: "" },
});
