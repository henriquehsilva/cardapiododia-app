import { useEffect, useState } from 'react';

export default function ItemSocial({ store, item, onClose }) {
  const [comments, setComments] = useState([]);
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  useEffect(() => {
    fetch(`/.netlify/functions/product-social?storeId=${encodeURIComponent(store.id)}&productId=${encodeURIComponent(item.id)}`)
      .then(response => response.ok ? response.json() : Promise.reject())
      .then(result => setComments(result.comments || []))
      .catch(() => setError('Comentários indisponíveis neste ambiente.'));
  }, [store.id, item.id]);
  const submit = async event => {
    event.preventDefault(); setError('');
    const response = await fetch('/.netlify/functions/product-social', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'comment', storeId: store.id, productId: item.id, author, text }) });
    const result = await response.json();
    if (!response.ok) return setError(result.error);
    setComments(current => [result.comment, ...current]); setText('');
  };
  return <div className="modal-backdrop" onMouseDown={event => event.target === event.currentTarget && onClose()}><section className="comments-modal"><button className="modal-close" onClick={onClose}>×</button><p className="eyebrow">COMENTÁRIOS</p><h2>{item.name}</h2><form onSubmit={submit}><input required minLength="2" maxLength="40" placeholder="Seu nome" value={author} onChange={event => setAuthor(event.target.value)} /><textarea required maxLength="300" placeholder="Conte o que achou" value={text} onChange={event => setText(event.target.value)} /><button className="button primary">Publicar comentário</button></form>{error && <p className="error">{error}</p>}<div className="comments-list">{comments.map(comment => <article key={comment.id}><b>{comment.author}</b><p>{comment.text}</p></article>)}{!comments.length && !error && <p>Seja a primeira pessoa a comentar.</p>}</div></section></div>;
}
