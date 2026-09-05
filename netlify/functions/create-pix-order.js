import { firebaseAdmin, json } from "./_firebase.js";
import { cleanCustomer, validCustomer } from "./_orders.js";
import { createOrder } from './_order-items.js';

export default async function (request) {
  if (request.method !== "POST")
    return json(405, { error: "Método não permitido." });
  try {
    const { storeId: requestedStoreId, slug, items, customer: rawCustomer } = await request.json();
    const customer = cleanCustomer(rawCustomer);
    if ((!requestedStoreId && !slug) || !Array.isArray(items) || !items.length)
      return json(400, { error: "Sacola inválida." });
    if (!validCustomer(customer))
      return json(400, { error: "Preencha nome, e-mail e WhatsApp válidos." });

    const admin = firebaseAdmin();
    const firestore = admin.firestore();
    let storeRef = requestedStoreId ? firestore.doc(`stores/${requestedStoreId}`) : null;
    let storeSnap = storeRef ? await storeRef.get() : null;
    if ((!storeSnap || !storeSnap.exists) && slug) {
      const matches = await firestore.collection("stores")
        .where("slug", "==", String(slug))
        .where("published", "==", true)
        .limit(1)
        .get();
      storeRef = matches.docs[0]?.ref || null;
      storeSnap = storeRef ? await storeRef.get() : null;
    }
    const store = storeSnap?.data() || {};
    const payment = store.payment || {};
    const pixKey = String(payment.pixKey || store.pixKey || "").trim();
    // A valid saved key is enough to keep Pix available. Older store records
    // may contain the key but have an outdated/missing `enabled` flag.
    const pixEnabled = Boolean(pixKey);
    if (!storeSnap?.exists)
      return json(404, { error: "Loja não encontrada para o pagamento Pix." });
    if (!store.published)
      return json(409, { error: "Publique a loja antes de receber pagamentos Pix." });
    if (!pixEnabled || !pixKey)
      return json(409, { error: "Cadastre uma chave Pix válida e salve novamente." });

    const storeId = storeRef.id;
    const orderRef = firestore.collection(`stores/${storeId}/orders`).doc();
    const { totalCents } = await createOrder({
      firestore,
      admin,
      storeId,
      requestedItems: items,
      orderRef,
      orderData: {
        customer,
        status: "pending_confirmation",
        provider: "pix",
      },
    });
    return json(200, { orderId: orderRef.id, total: totalCents / 100 });
  } catch (error) {
    console.error(error);
    return json(400, {
      error: error.message || "Não foi possível criar o pedido Pix.",
    });
  }
}
