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
    unavailable: true,
    imageUrl:
      "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=800&q=80",
  },
];

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
