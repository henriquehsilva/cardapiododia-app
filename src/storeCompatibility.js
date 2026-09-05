const digits = (value) => String(value || '').replace(/\D/g, '');

export function normalizeStore(store = {}) {
  const legacy = store.navbar || store.hero || store.about;
  if (!legacy) return store;
  const category = { id: 'pratos-do-dia', name: 'Pratos do dia' };
  return {
    ...store,
    brand: store.brand || store.navbar?.brand || '',
    tagline: store.tagline || store.hero?.message || '',
    description: store.description || store.about?.description || '',
    heroImage: store.heroImage || store.hero?.imageUrl || '',
    logoUrl: store.logoUrl || store.navbar?.logoUrl || '',
    whatsapp: store.whatsapp || digits(store.hero?.whatsappNumber || store.about?.contact),
    instagram: store.instagram || store.navbar?.links?.instagramUrl || '',
    address: store.address || store.about?.location || '',
    city: store.city || '',
    state: store.state || '',
    hours: store.hours || store.about?.businessHours || store.navbar?.hours || '',
    categories: store.categories?.length ? store.categories : [category],
    payment: store.payment || {
      enabled: Boolean(store.pixKey),
      pixKey: store.pixKey || '',
      pixReceiverName: store.navbar?.brand || '',
      pixCity: store.city || '',
    },
  };
}

export function normalizeMenuItems(items = [], store = {}) {
  const defaultCategory = normalizeStore(store).categories?.[0] || {
    id: 'pratos-do-dia',
    name: 'Pratos do dia',
  };
  return items.map((item) => ({
    ...item,
    categoryId: item.categoryId || defaultCategory.id,
    category: item.category || defaultCategory.name,
  }));
}
