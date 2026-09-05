const jsonHeaders = {
  'Content-Type': 'application/manifest+json; charset=utf-8',
  'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600',
  'Access-Control-Allow-Origin': '*',
};

const firestoreValue = value => {
  if (!value) return undefined;
  if ('stringValue' in value) return value.stringValue;
  if ('booleanValue' in value) return value.booleanValue;
  if ('integerValue' in value) return Number(value.integerValue);
  if ('doubleValue' in value) return value.doubleValue;
  if ('mapValue' in value) return Object.fromEntries(Object.entries(value.mapValue.fields || {}).map(([key, child]) => [key, firestoreValue(child)]));
  if ('arrayValue' in value) return (value.arrayValue.values || []).map(firestoreValue);
  return undefined;
};

const fallbackManifest = slug => ({
  id: `/loja/${slug}`,
  name: 'Cardápio do Dia',
  short_name: 'Cardápio',
  description: 'Cardápio digital e pedidos pelo WhatsApp.',
  start_url: `/loja/${slug}`,
  scope: '/',
  display: 'standalone',
  background_color: '#ffffff',
  theme_color: '#00838a',
  lang: 'pt-BR',
  icons: [
    { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
    { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
  ],
});

export const handler = async event => {
  const slug = String(event.queryStringParameters?.slug || '').toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 100);
  if (!slug) return { statusCode: 400, headers: jsonHeaders, body: JSON.stringify({ error: 'Loja não informada.' }) };

  const projectId = process.env.VITE_FIREBASE_PROJECT_ID;
  const apiKey = process.env.VITE_FIREBASE_API_KEY;
  if (!projectId) return { statusCode: 200, headers: jsonHeaders, body: JSON.stringify(fallbackManifest(slug)) };

  try {
    const endpoint = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}/databases/(default)/documents:runQuery${apiKey ? `?key=${encodeURIComponent(apiKey)}` : ''}`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ structuredQuery: { from: [{ collectionId: 'stores' }], where: { fieldFilter: { field: { fieldPath: 'slug' }, op: 'EQUAL', value: { stringValue: slug } } }, limit: 10 } }),
    });
    if (!response.ok) throw new Error(`Firestore respondeu ${response.status}`);
    const results = await response.json();
    const documents = results.map(result => result.document).filter(Boolean).sort((a,b) => String(b.updateTime).localeCompare(String(a.updateTime)));
    const document = documents.find(item => firestoreValue(item.fields?.published) === true) || documents[0];
    if (!document) return { statusCode: 404, headers: jsonHeaders, body: JSON.stringify(fallbackManifest(slug)) };

    const store = Object.fromEntries(Object.entries(document.fields || {}).map(([key, value]) => [key, firestoreValue(value)]));
    const brand = String(store.navbar?.brand || 'Cardápio do Dia').trim();
    const description = String(store.hero?.message || `Confira o cardápio e faça seu pedido na ${brand}.`).replace('{local}', store.hero?.deliveryLocation || 'sua região').trim();
    const logo = String(store.navbar?.logoUrl || '').trim();
    const manifest = {
      ...fallbackManifest(slug),
      id: `/loja/${slug}`,
      name: brand,
      short_name: brand.slice(0, 30),
      description: description.slice(0, 160),
      start_url: `/loja/${slug}`,
    };
    if (/^https:\/\//i.test(logo)) manifest.icons = [
      { src: logo, sizes: '192x192', purpose: 'any' },
      { src: logo, sizes: '512x512', purpose: 'any maskable' },
      ...manifest.icons,
    ];
    return { statusCode: 200, headers: jsonHeaders, body: JSON.stringify(manifest) };
  } catch (error) {
    console.error('Não foi possível gerar o manifesto da loja:', error);
    return { statusCode: 200, headers: jsonHeaders, body: JSON.stringify(fallbackManifest(slug)) };
  }
};
