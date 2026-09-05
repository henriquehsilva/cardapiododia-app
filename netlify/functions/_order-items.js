import {
  discountPercent,
  discountedPriceInCents,
  priceInCents,
} from './_orders.js';

export const requestedProducts = (items) => {
  const requested = new Map();
  for (const item of items || []) {
    const id = String(item?.id || '').trim();
    if (!id) continue;
    const quantity = Math.max(1, Math.min(99, Math.floor(Number(item.quantity)) || 1));
    requested.set(id, Math.min(99, (requested.get(id) || 0) + quantity));
  }
  return [...requested].map(([id, quantity]) => ({ id, quantity }));
};

export async function createOrder({
  firestore,
  admin,
  storeId,
  requestedItems,
  orderRef,
  orderData,
}) {
  const requested = requestedProducts(requestedItems);
  if (!requested.length) throw new Error('Sacola inválida.');

  return firestore.runTransaction(async (transaction) => {
    const products = [];
    for (const item of requested) {
      const ref = firestore.doc(`stores/${storeId}/menuItems/${item.id}`);
      const snapshot = await transaction.get(ref);
      const data = snapshot.data();
      const originalUnitPriceCents = priceInCents(data?.price);
      const appliedDiscount = discountPercent(data?.discountPercent ?? data?.cashbackPercent);
      const unitPriceCents = discountedPriceInCents(data?.price, appliedDiscount);
      if (
        !snapshot.exists ||
        data.unavailable === true ||
        data.active === false ||
        !Number.isSafeInteger(originalUnitPriceCents) ||
        !Number.isSafeInteger(unitPriceCents) ||
        unitPriceCents <= 0
      ) throw new Error(`${data?.name || 'Um prato'} está indisponível.`);
      products.push({ id: snapshot.id, data, quantity: item.quantity, unitPriceCents, originalUnitPriceCents, appliedDiscount });
    }

    const items = products.map((product) => ({
      productId: product.id,
      name: product.data.name,
      quantity: product.quantity,
      unitPrice: product.unitPriceCents / 100,
      originalUnitPrice: product.originalUnitPriceCents / 100,
      discountPercent: product.appliedDiscount,
    }));
    const totalCents = products.reduce(
      (total, product) => total + product.unitPriceCents * product.quantity,
      0,
    );
    transaction.set(orderRef, {
      ...orderData,
      items,
      total: totalCents / 100,
      totalCents,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return { items, totalCents, products };
  });
}
