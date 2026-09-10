import { firebaseAdmin, json } from './_firebase.js';

export default async function (request) {
  if (request.method !== 'GET')
    return json(405, { error: 'Método não permitido.' });

  try {
    const url = new URL(request.url);
    const storeId = String(url.searchParams.get('storeId') || '').trim();
    const orderId = String(url.searchParams.get('orderId') || '').trim();
    const token = String(url.searchParams.get('token') || '').trim();
    if (!storeId || !orderId || !token)
      return json(400, { error: 'Link de acompanhamento inválido.' });

    const admin = firebaseAdmin();
    const firestore = admin.firestore();
    const [storeSnap, orderSnap] = await Promise.all([
      firestore.doc(`stores/${storeId}`).get(),
      firestore.doc(`stores/${storeId}/orders/${orderId}`).get(),
    ]);
    if (!storeSnap.exists || !orderSnap.exists || orderSnap.data()?.trackingToken !== token)
      return json(404, { error: 'Pedido não encontrado.' });

    const order = orderSnap.data();
    const createdAt = order.createdAt?.toDate?.()?.toISOString?.() || null;
    return json(200, {
      id: orderSnap.id,
      store: {
        brand: storeSnap.data()?.brand || 'Loja',
        slug: storeSnap.data()?.slug || '',
        whatsapp: storeSnap.data()?.whatsapp || '',
      },
      status: order.status || 'pending_confirmation',
      provider: order.provider || '',
      total: Number(order.total) || 0,
      items: (order.items || []).map((item) => ({
        name: item.name,
        quantity: Number(item.quantity) || 1,
        unitPrice: Number(item.unitPrice) || 0,
      })),
      createdAt,
    });
  } catch (error) {
    console.error(error);
    return json(400, { error: 'Não foi possível acompanhar o pedido.' });
  }
}
