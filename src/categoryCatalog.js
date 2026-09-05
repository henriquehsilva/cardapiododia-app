export const CATEGORY_GROUPS = [
  ["Refeições", ["Marmitas", "Pratos do dia", "Executivos", "Brasileira", "Italiana", "Japonesa", "Árabe", "Mexicana", "Vegetarianos", "Veganos", "Fitness", "Congelados"]],
  ["Lanches", ["Hambúrgueres", "Pizzas", "Sanduíches", "Pastéis", "Salgados", "Tapiocas", "Açaí"]],
  ["Doces e padaria", ["Doces", "Bolos", "Sobremesas", "Padaria", "Confeitaria", "Sorvetes"]],
  ["Bebidas", ["Bebidas", "Sucos", "Refrigerantes", "Cafés", "Chás", "Drinks"]],
  ["Complementos", ["Entradas", "Porções", "Saladas", "Molhos", "Adicionais", "Combos"]],
];

export const CATEGORY_OPTIONS = CATEGORY_GROUPS.flatMap(([group, items]) =>
  items.map((name) => ({ name, group })),
);

export const normalizeCategory = (value) => String(value || "")
  .normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

export function categorySuggestions(search, selected = []) {
  const term = normalizeCategory(search);
  const used = new Set(selected.map(normalizeCategory));
  return CATEGORY_OPTIONS.filter(({ name, group }) =>
    !used.has(normalizeCategory(name))
    && (!term || normalizeCategory(`${name} ${group}`).includes(term)),
  );
}

export function categoryIconType(name) {
  const value = normalizeCategory(name);
  if (/marmita|prato|executivo|brasileira|italiana|japonesa|arabe|mexicana|congelado/.test(value)) return "food";
  if (/hamburg|pizza|sanduiche|pastel|salgado|tapioca|acai/.test(value)) return "shop";
  if (/veget|vegan|fitness|salada/.test(value)) return "garden";
  if (/eletron|celular|informatica|audio|video|game|eletrodom/.test(value)) return "tech";
  if (/moda|roupa|calcado|bolsa|joia|relogio|oculos|acessor/.test(value)) return "fashion";
  if (/casa|decor|moveis|cama|cozinha|ilumin|organiz|artesan|ceram/.test(value)) return "home";
  if (/beleza|cosmetic|maquiagem|perfume|pele|cabelo|higiene|barbear/.test(value)) return "beauty";
  if (/alimento|doce|bolo|salgado|cafe|bebida|congelado|padaria|restaurante/.test(value)) return "food";
  if (/esporte|academia|bicicleta|ciclis|futebol|corrida|natacao|skate|patins|camping|pesca/.test(value)) return "sport";
  if (/infantil|brinquedo|bebe|escolar/.test(value)) return "kids";
  if (/pet|animal/.test(value)) return "pet";
  if (/papel|convite|festa|presente|embalagem/.test(value)) return "paper";
  if (/jard|planta|flor|semente|vaso|piscina|churrasqueira/.test(value)) return "garden";
  if (/auto|moto|veiculo|peca/.test(value)) return "auto";
  if (/servico|fotografia|design|grafica|manutencao|assistencia|limpeza|costura|aula|evento|buffet|frete|mudanca|saude|farmacia|ortopedia|medico|hospital|vitamina|idoso|construcao|ferragem|eletrica|hidraulica|tinta|piso|revestimento|porta|janela|seguranca|agro|agricola|racao|selaria|turismo|hospedagem|viagem/.test(value)) return "service";
  if (/livro|instrumento|colecion/.test(value)) return "leisure";
  return "shop";
}
