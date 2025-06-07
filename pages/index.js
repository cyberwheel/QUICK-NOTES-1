// File: pages/index.js
import { useEffect, useState } from 'react';
import Link from 'next/link';
import SearchBar from '../components/SearchBar';
import DocumentList from '../components/DocumentList';

export default function Home() {
  const [docs, setDocs] = useState([]);
  const [filters, setFilters] = useState({ search: '', category: '' });
  const [sortKey, setSortKey] = useState('date_desc'); // default sort
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/docs')
      .then((res) => res.json())
      .then((data) => {
        setDocs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load docs:', err);
        setLoading(false);
      });
  }, []);

  const filtered = docs.filter((doc) => {
    const s = filters.search.toLowerCase();
    const matchesSearch =
      doc.title.toLowerCase().includes(s) ||
      doc.tags.some((tag) => tag.includes(s));
    const matchesCategory = filters.category
      ? doc.category === filters.category
      : true;
    return matchesSearch && matchesCategory;
  });

  const sortedDocs = [...filtered].sort((a, b) => {
    switch (sortKey) {
      case 'date_asc':
        return new Date(a.addedAt) - new Date(b.addedAt);
      case 'date_desc':
        return new Date(b.addedAt) - new Date(a.addedAt);
      case 'title_asc':
        return a.title.localeCompare(b.title);
      case 'title_desc':
        return b.title.localeCompare(a.title);
      default:
        return 0;
    }
  });

  const categories = Array.from(
    new Set(docs.map((d) => d.category).filter(Boolean))
  );

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800">📄 Documents</h1>
        <Link href="/admin" passHref>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
            Admin Login
          </button>
        </Link>
      </header>

      {/* Filters */}
      <section className="space-y-4 sm:space-y-0 sm:flex sm:items-end sm:space-x-4 mb-6">
        <div className="flex-1">
          <SearchBar filters={filters} setFilters={setFilters} />
        </div>

        <div className="w-full sm:w-48">
          <select
            value={filters.category}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value })
            }
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full sm:w-56">
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="date_desc">Date: Newest first</option>
            <option value="date_asc">Date: Oldest first</option>
            <option value="title_asc">Title: A → Z</option>
            <option value="title_desc">Title: Z → A</option>
          </select>
        </div>
      </section>

      {/* Document List */}
      {loading ? (
        <div className="text-center text-gray-500 mt-12">Loading documents...</div>
      ) : (
        <DocumentList docs={sortedDocs} />
      )}
    </div>
  );
}
