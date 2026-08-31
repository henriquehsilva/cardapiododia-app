import Stripe from 'stripe';

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method not allowed' };
  try {
    const data = JSON.parse(event.body || '{}');
    const required = ['name', 'email', 'phone', 'document', 'address', 'city', 'state', 'zip'];
    if (required.some((key) => !String(data[key] || '').trim())) return { statusCode: 400, body: JSON.stringify({ error: 'Preencha todos os campos obrigatórios.' }) };
    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_PRO_PRICE_ID) return { statusCode: 503, body: JSON.stringify({ error: 'Stripe ainda não foi configurado no servidor.' }) };
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const origin = event.headers.origin || process.env.URL || 'http://localhost:5173';
    const customer = await stripe.customers.create({
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: { line1: data.address, city: data.city, state: data.state, postal_code: data.zip, country: 'BR' },
      metadata: { customer_type: data.customerType === 'empresa' ? 'empresa' : 'pessoa_fisica', document: data.document, company_name: data.companyName || '' },
    });
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription', customer: customer.id, line_items: [{ price: process.env.STRIPE_PRO_PRICE_ID, quantity: 1 }],
      billing_address_collection: 'required', customer_update: { address: 'auto', name: 'auto' },
      tax_id_collection: { enabled: data.customerType === 'empresa' }, allow_promotion_codes: true,
      success_url: `${origin}/admin?checkout=success`, cancel_url: `${origin}/?checkout=cancelled`,
    });
    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: session.url }) };
  } catch (error) { return { statusCode: 500, body: JSON.stringify({ error: error.message || 'Não foi possível iniciar o pagamento.' }) }; }
};
