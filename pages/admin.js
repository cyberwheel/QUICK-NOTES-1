// File: pages/admin.js
import { useState, useEffect } from 'react';

export default function Admin() {
  const [isAuth, setIsAuth] = useState(false);
  const [secret, setSecret] = useState('');
  const [form, setForm] = useState({
    fileLink: '',
    title: '',
    tags: '',
    category: '',
  });
  const [docs, setDocs] = useState([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (isAuth) {
      fetch('/api/docs')
        .then(r => r.json())
        .then(setDocs)
        .catch(console.error);
    }
  }, [isAuth]);

  const handleLogin = e => {
    e.preventDefault();
    if (secret === process.env.NEXT_PUBLIC_ADMIN_SECRET) {
      setIsAuth(true);
      setMsg('');
    } else {
      setMsg('Incorrect secret key');
    }
  };

  const handleAdd = async e => {
    e.preventDefault();
    setMsg('');
    const res = await fetch('/api/addDoc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, ...form }),
    });
    const data = await res.json();
    if (res.ok) {
      setMsg(`Added: "${data.title}"`);
      setForm({ fileLink: '', title: '', tags: '', category: '' });
      setDocs(prev => [...prev, data]);
    } else {
      setMsg(data.error || 'Add failed');
    }
  };

  const handleDelete = async id => {
    if (!confirm('Delete this document?')) return;
    setMsg('');
    const res = await fetch('/api/deleteDoc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, id }),
    });
    if (res.ok) {
      setMsg('Deleted successfully');
      setDocs(prev => prev.filter(d => d.id !== id));
    } else {
      const data = await res.json();
      setMsg(data.error || 'Delete failed');
    }
  };

  if (!isAuth) {
    return (
      <div className="container mx-auto p-4 max-w-md">
        <h1 className="text-2xl mb-4">Admin Login</h1>
        {msg && <p className="text-red-600 mb-4">{msg}</p>}
        <form onSubmit={handleLogin} className="space-y-3">
          <input
            type="password"
            placeholder="Enter secret key"
            value={secret}
            onChange={e => setSecret(e.target.value)}
            className="w-full border p-2"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-xl">
      <h1 className="text-2xl mb-4">Admin Panel</h1>
      {msg && <p className="text-green-700 mb-4">{msg}</p>}

      {/* Add Document Form */}
      <form onSubmit={handleAdd} className="space-y-3 mb-8">
        <input
          type="url"
          placeholder="Google Drive File Link"
          value={form.fileLink}
          onChange={e => setForm({ ...form, fileLink: e.target.value })}
          className="w-full border p-2"
          required
        />

        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          className="w-full border p-2"
          required
        />

        <input
          type="text"
          placeholder="Tags (comma-separated)"
          value={form.tags}
          onChange={e => setForm({ ...form, tags: e.target.value })}
          className="w-full border p-2"
        />

        <input
          type="text"
          placeholder="Category"
          value={form.category}
          onChange={e => setForm({ ...form, category: e.target.value })}
          className="w-full border p-2"
        />

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Add Document
        </button>
      </form>

      {/* Existing Documents */}
      <h2 className="text-xl mb-2">Existing Documents</h2>
      {docs.length === 0 ? (
        <p>No documents yet.</p>
      ) : (
        <ul className="space-y-2">
          {docs.map(doc => (
            <li
              key={doc.id}
              className="flex justify-between items-center border p-2 rounded"
            >
              <div>
                <strong>{doc.title}</strong>
                <p className="text-xs text-gray-600">Category: {doc.category}</p>
                <p className="text-xs text-gray-600">Tags: {doc.tags.join(', ')}</p>
                <p className="text-xs text-gray-600">Link: {doc.fileLink}</p>
              </div>
              <button
                onClick={() => handleDelete(doc.id)}
                className="px-2 py-1 bg-red-500 text-white rounded text-sm"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
