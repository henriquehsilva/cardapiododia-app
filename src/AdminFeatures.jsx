import { useEffect, useMemo, useState } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { auth, db, firebaseEnabled } from './firebase';
import CategoryAutocomplete from './CategoryAutocomplete';
import CustomDomainSetup from './CustomDomainSetup';
import BrazilianCityPicker from './BrazilianCityPicker';
import { CATEGORY_OPTIONS } from './categoryCatalog';
import { paidOrdersInPeriod, periodSummary } from './periodReportData';

const money = value => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value) || 0);
const dateValue = value => value?.toDate?.() || new Date(value);

export default function AdminFeatures({ store, items, setItems, update, save, notice }) {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [start, setStart] = useState(new Date().toISOString().slice(0, 8) + '01');
  const [end, setEnd] = useState(new Date().toISOString().slice(0, 10));
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (!firebaseEnabled || !store.id) return undefined;
    return onSnapshot(query(collection(db, 'stores', store.id, 'orders'), orderBy('createdAt', 'desc')), snapshot => setOrders(snapshot.docs.map(item => ({ id: item.id, ...item.data() }))));
  }, [store.id]);
  const categories = store.categories || [];
  const filtered = useMemo(() => orders.filter(order => JSON.stringify(order).toLowerCase().includes(search.toLowerCase())), [orders, search]);
  const reportOrders = paidOrdersInPeriod(orders, start, end);
  const summary = periodSummary(reportOrders);
  const call = async (endpoint, body) => {
    setBusy(true);
    try {
      const token = await auth?.currentUser?.getIdToken();
      const response = await fetch(`/.netlify/functions/${endpoint}`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify(body) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      return result;
    } finally { setBusy(false); }
  };
  const connectStripe = async () => {
    try { const result = await call('create-connect-account', { storeId: store.id }); window.location.href = result.onboardingUrl; }
    catch (error) { notice(`Não foi possível conectar a Stripe: ${error.message}`); }
  };
  const changeOrder = async (order, cancel = false) => {
    try { await call(cancel ? 'refund-manual-order' : 'confirm-manual-order', { storeId: store.id, orderId: order.id }); }
    catch (error) { notice(`Não foi possível atualizar o pedido: ${error.message}`); }
  };
  const downloadReport = async () => {
    if (!reportOrders.length) return notice('Não há pedidos pagos neste período.');
    const { generatePeriodPdf } = await import('./periodReport');
    await generatePeriodPdf({ store: { ...store, brand: store.navbar.brand }, orders: reportOrders, start, end, appUrl: location.origin });
  };
  const addCategory = name => {
    const trimmed = name.trim();
    if (!trimmed || categories.some(item => item.name.toLowerCase() === trimmed.toLowerCase())) return;
    update('categories', [...categories, { id: crypto.randomUUID(), name: trimmed }]);
  };
  const removeCategory = id => {
    if (items.some(item => item.categoryId === id)) return notice('Mova os pratos desta categoria antes de removê-la.');
    update('categories', categories.filter(item => item.id !== id));
  };
  return <div className="admin-features">
    <section><p className="eyebrow">LOCALIZAÇÃO</p><h2>Onde seu restaurante atende?</h2><BrazilianCityPicker state={store.state || ''} city={store.city || ''} onChange={({ state, city }) => { update('state', state); update('city', city); }} /></section>
    <section><p className="eyebrow">ORGANIZAÇÃO</p><h2>Categorias do cardápio</h2><CategoryAutocomplete categories={categories.map(item => item.name)} onAdd={addCategory} options={CATEGORY_OPTIONS} /><div className="category-chips">{categories.map(item => <button type="button" key={item.id} onClick={() => removeCategory(item.id)}>{item.name} ×</button>)}</div><div className="feature-item-list">{items.map(item => <label key={item.id}><span>{item.name}</span><select value={item.categoryId || ''} onChange={event => setItems(current => current.map(entry => entry.id === item.id ? { ...entry, categoryId: event.target.value, category: categories.find(category => category.id === event.target.value)?.name || '' } : entry))}><option value="">Sem categoria</option>{categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>)}</div></section>
    <section><p className="eyebrow">PAGAMENTOS</p><h2>Pix e cartão à vista</h2><label className="feature-check"><input type="checkbox" checked={Boolean(store.payment?.enabled)} onChange={event => update('payment.enabled', event.target.checked)} />Aceitar Pix com QR Code</label><input placeholder="Chave Pix" value={store.payment?.pixKey || store.pixKey || ''} onChange={event => { update('pixKey', event.target.value); update('payment.pixKey', event.target.value); }} /><input placeholder="Nome do recebedor" value={store.payment?.pixReceiverName || store.navbar.brand} onChange={event => update('payment.pixReceiverName', event.target.value)} /><input placeholder="Cidade do recebedor" value={store.payment?.pixCity || ''} onChange={event => update('payment.pixCity', event.target.value.toUpperCase())} /><button className="button outline" type="button" disabled={!store.id || busy} onClick={connectStripe}>{store.payment?.stripeConnected ? 'Gerenciar conta Stripe' : 'Conectar Stripe'}</button><small>Cartões e carteiras digitais são sempre cobrados à vista.</small></section>
    <section><p className="eyebrow">DOMÍNIO</p><CustomDomainSetup value={store.customDomain || ''} destination={`${location.origin}/loja/${store.slug}`} onChange={value => update('customDomain', value)} /></section>
    <section><p className="eyebrow">PEDIDOS</p><h2>Gestão de pedidos</h2><input type="search" placeholder="Buscar cliente, prato ou pagamento" value={search} onChange={event => setSearch(event.target.value)} /><div className="orders-list">{filtered.map(order => <article key={order.id}><div><b>{order.customer?.name || 'Cliente'}</b><small>{dateValue(order.createdAt).toLocaleString('pt-BR')} · {order.provider || 'WhatsApp'}</small></div><strong>{money(order.total || (order.items || []).reduce((sum, item) => sum + Number(item.unitPrice || item.price) * item.quantity, 0))}</strong><span className={`order-status ${order.status}`}>{order.status || 'novo'}</span>{order.status !== 'paid' && <button type="button" onClick={() => changeOrder(order)}>Confirmar</button>}{!['cancelled', 'refunded'].includes(order.status) && <button type="button" onClick={() => changeOrder(order, true)}>Cancelar</button>}</article>)}</div>{!filtered.length && <p>Nenhum pedido encontrado.</p>}</section>
    <section><p className="eyebrow">RELATÓRIO</p><h2>Fechamento por período</h2><div className="report-fields"><input type="date" value={start} onChange={event => setStart(event.target.value)} /><input type="date" value={end} onChange={event => setEnd(event.target.value)} /></div><div className="report-summary"><span><b>{money(summary.total)}</b>Total pago</span><span><b>{reportOrders.length}</b>Pedidos</span><span><b>{summary.items}</b>Itens</span></div><button className="button outline" type="button" onClick={downloadReport}>Baixar PDF</button></section>
    <button className="button primary" type="button" disabled={busy} onClick={() => save()}>Salvar recursos</button>
  </div>;
}
