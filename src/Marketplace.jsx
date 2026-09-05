import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, firebaseEnabled } from './firebase';
import { demoStore } from './data';
import BrazilianCityPicker from './BrazilianCityPicker';

const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const storeName = store => store.navbar?.brand || store.brand || 'Restaurante';

export default function Marketplace() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    document.title = 'Descubra restaurantes | Cardápio do Dia';
    const load = async () => {
      if (!firebaseEnabled) {
        const saved = JSON.parse(localStorage.getItem('cdd-demo-store') || 'null');
        setStores([...(saved?.published ? [saved] : []), demoStore]);
      } else {
        const snapshot = await getDocs(query(collection(db, 'stores'), where('published', '==', true)));
        setStores(snapshot.docs.map(item => ({ id: item.id, ...item.data() })));
      }
      setLoading(false);
    };
    load().catch(() => setLoading(false));
    return () => { document.title = 'Cardápio do Dia'; };
  }, []);
  const filtered = useMemo(() => stores.filter(store => {
    const text = normalize(`${storeName(store)} ${store.about?.description || ''} ${(store.categories || []).map(x => x.name).join(' ')}`);
    const location = normalize(`${store.city || ''} ${store.state || ''} ${store.about?.location || ''}`);
    return text.includes(normalize(search)) && (!state || location.includes(normalize(state))) && (!city || location.includes(normalize(city)));
  }), [stores, search, state, city]);
  return <div className="marketplace-page"><header className="marketing-nav"><Link className="product-logo" to="/">cardápio<span>do dia</span></Link><nav><Link to="/">Início</Link><Link className="button primary small" to="/admin">Criar cardápio</Link></nav></header><main><section className="marketplace-hero"><p className="eyebrow">COMIDA PERTO DE VOCÊ</p><h1>Encontre restaurantes e cardápios especiais.</h1><div className="marketplace-filters"><input type="search" placeholder="Buscar restaurante ou prato" value={search} onChange={event => setSearch(event.target.value)} /><BrazilianCityPicker state={state} city={city} onChange={({ state: nextState, city: nextCity }) => { setState(nextState); setCity(nextCity); }} compact /></div></section><section className="marketplace-results"><h2>{loading ? 'Buscando restaurantes…' : `${filtered.length} cardápio${filtered.length === 1 ? '' : 's'} encontrado${filtered.length === 1 ? '' : 's'}`}</h2><div className="marketplace-grid">{filtered.map(store => <article key={store.id || store.slug}><img src={store.hero?.imageUrl || store.heroImage || demoStore.hero.imageUrl} alt="" /><div><span className="eyebrow">{store.city || store.state || 'DELIVERY'}</span><h3>{storeName(store)}</h3><p>{store.about?.description || store.tagline || 'Confira o cardápio e faça seu pedido.'}</p><Link className="button outline" to={`/loja/${store.slug}`}>Ver cardápio</Link></div></article>)}</div>{!loading && !filtered.length && <p className="marketplace-empty">Nenhum cardápio encontrado com esses filtros.</p>}</section></main></div>;
}
