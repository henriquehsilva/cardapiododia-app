export const normalizeStoreData = (store = {}) => ({
  ...store,
  brand: store.brand || store.navbar?.brand || '',
  tagline: store.tagline || store.hero?.message || '',
  description: store.description || store.about?.description || '',
  heroImage: store.heroImage || store.hero?.imageUrl || '',
  logoUrl: store.logoUrl || store.navbar?.logoUrl || '',
  whatsapp: store.whatsapp || store.hero?.whatsappNumber || '',
  instagram: store.instagram || store.navbar?.links?.instagramUrl || '',
  address: store.address || store.about?.location || '',
  hours: store.hours || store.about?.businessHours || store.navbar?.hours || '',
  payment: store.payment || { enabled: Boolean(store.pixKey), pixKey: store.pixKey || '' },
});
