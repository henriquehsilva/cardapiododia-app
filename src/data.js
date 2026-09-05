export const demoStore = {
  id: "demo",
  slug: "marmitaria-da-fatima",
  published: true,
  brand: "Marmitaria da Fátima",
  tagline: "Comida caseira feita com carinho todos os dias.",
  description: "Pratos frescos e preparados para o seu almoço.",
  heroImage:
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1500&q=85",
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
    { id: "pratos-do-dia", name: "Pratos do dia" },
    { id: "vegetarianos", name: "Vegetarianos" },
  ],
  payment: {
    enabled: true,
    pixKey: "11999999999",
    pixReceiverName: "FATIMA SILVA",
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
    price: 129.9,
    cashbackPercent: 10,
    stock: 8,
    unavailable: false,
    imageUrl:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "2",
    name: "Carne de panela",
    category: "Pratos do dia",
    categoryId: "pratos-do-dia",
    description: "Cozida lentamente, com arroz, feijão e farofa.",
    price: 89.9,
    stock: 5,
    unavailable: false,
    imageUrl:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "3",
    name: "Opção vegetariana",
    category: "Vegetarianos",
    categoryId: "vegetarianos",
    description: "Abóbora assada, grão-de-bico e arroz integral.",
    price: 74.5,
    stock: 0,
    unavailable: true,
    imageUrl:
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80",
  },
];

const marketplaceSamples = [
  ["atelier-lume", "Ateliê Lume", "Decoração autoral para uma casa cheia de afeto.", "Pratos do dia", "Curitiba · PR", "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80", "terracotta"],
  ["flora-botanica", "Flora Botânica", "Plantas, vasos e presentes que respiram vida.", "Jardim", "Goiânia · GO", "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=900&q=80", "graphite"],
  ["maria-bonita", "Maria Bonita", "Moda leve, versátil e feita para você.", "Moda", "Recife · PE", "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=80", "rose"],
  ["grao-cafe", "Grão Café", "Cafés especiais torrados em pequenos lotes.", "Alimentos", "Belo Horizonte · MG", "https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=900&q=80", "terracotta"],
  ["onda-studio", "Onda Studio", "Acessórios que acompanham todos os seus dias.", "Marmitas", "Rio de Janeiro · RJ", "https://images.unsplash.com/photo-1523779917675-b6ed3a42a561?auto=format&fit=crop&w=900&q=80", "sky"],
  ["doce-afeto", "Doce Afeto", "Doces artesanais para celebrar cada momento.", "Alimentos", "São Paulo · SP", "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?auto=format&fit=crop&w=900&q=80", "rose"],
  ["essencia-natural", "Essência Natural", "Autocuidado consciente, gentil e brasileiro.", "Vegetarianos", "Salvador · BA", "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=80", "violet"],
  ["pequenos-sonhos", "Pequenos Sonhos", "Peças lúdicas para infâncias inesquecíveis.", "Infantil", "Florianópolis · SC", "https://images.unsplash.com/photo-1599443015574-be5fe8a05783?auto=format&fit=crop&w=900&q=80", "sky"],
  ["papel-e-prosa", "Papel & Prosa", "Papelaria criativa para organizar e inspirar.", "Papelaria", "Fortaleza · CE", "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80", "violet"],
  ["ceramica-sol", "Cerâmica Sol", "Objetos únicos moldados e pintados à mão.", "Pratos do dia", "Campinas · SP", "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=900&q=80", "terracotta"],
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
