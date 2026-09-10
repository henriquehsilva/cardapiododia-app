import { firebaseAdmin, json } from "./_firebase.js";
import { cleanCustomer, validCustomer } from "./_orders.js";
import { createOrder } from './_order-items.js';

export default async function (request) {
  if (request.method !== "POST") return json(405, { error: "Método não permitido." });
  try {
    const { storeId: requestedStoreId, slug, items, customer: rawCustomer } = await request.json();
    const customer = cleanCustomer(rawCustomer);
    if ((!requestedStoreId && !slug) || !Array.isArray(items) || !items.length) return json(400, { error: "Sacola inválida." });
    if (!validCustomer(customer)) return json(400, { error: "Preencha nome, e-mail e WhatsApp válidos." });
    const admin = firebaseAdmin();
    const firestore = admin.firestore();
    let storeRef = requestedStoreId ? firestore.doc(`stores/${requestedStoreId}`) : null;
    let storeSnap = storeRef ? await storeRef.get() : null;
    if ((!storeSnap || !storeSnap.exists || !storeSnap.data()?.published) && slug) {
      const matches = await firestore.collection("stores")
        .where("slug", "==", String(slug))
        .where("published", "==", true)
        .limit(1)
        .get();
      storeRef = matches.docs[0]?.ref || null;
      storeSnap = storeRef ? await storeRef.get() : null;
    }
    if (!storeSnap?.exists || !storeSnap.data()?.published) return json(404, { error: "Loja indisponível." });
    const storeId = storeRef.id;
    const orderRef = firestore.collection(`stores/${storeId}/orders`).doc();
    const reservation = await createOrder({
      firestore, admin, storeId, requestedItems: items, orderRef,
      orderData: {
        customer,
        status: "pending_confirmation",
        provider: "delivery",
        paymentMethod: "card_on_delivery",
      },
    });
    return json(200, { orderId: orderRef.id, total: reservation.totalCents / 100 });
  } catch (error) {
    console.error(error);
    return json(400, { error: error.message || "Não foi possível registrar o pedido." });
  }
}
