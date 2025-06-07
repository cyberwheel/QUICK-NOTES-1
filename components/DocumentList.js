// File: components/DocumentList.js
import DocumentCard from './DocumentCard';

export default function DocumentList({ docs }) {
  if (!docs.length) return <p>No documents found.</p>;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {docs.map(d=> <DocumentCard key={d.id} doc={d} />)}
    </div>
  );
}
