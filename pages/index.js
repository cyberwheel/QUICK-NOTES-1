// File: pages/index.js
import { useEffect, useState } from 'react';
import DocumentCard from '../components/DocumentCard';

export default function Home() {
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    fetch('/docs.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load docs.json');
        return res.json();
      })
      .then(data => {
        if (!Array.isArray(data)) {
          console.error('docs.json did not return an array', data);
          return;
        }
        setDocs(data);
      })
      .catch(err => {
        console.error('Error loading documents:', err);
      });
  }, []);

  if (!docs.length) {
    return (
      <div className="p-4">
        <p>
          No documents found. Make sure <code>public/docs.json</code> exists
          and contains a JSON array.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Document Library</h1>
      {docs.map((doc, idx) => (
        <DocumentCard key={idx} doc={doc} />
      ))}
    </div>
  );
}
