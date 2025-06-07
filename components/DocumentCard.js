// File: components/DocumentCard.js
import { useState } from 'react';
import DrivePreview from './DrivePreview';

export default function DocumentCard({ doc }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border p-4 rounded shadow-md">
      <h3 className="text-xl font-semibold">{doc.title}</h3>
      <p className="text-gray-600">Category: {doc.category}</p>
      <p className="text-sm text-gray-500">Tags: {doc.tags.join(', ')}</p>

      <div className="mt-2 flex space-x-2">
        <button
          onClick={() => setOpen(true)}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Preview
        </button>
        <a
          href={doc.downloadLink}
          download
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
        >
          
        </a>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white p-2 rounded w-full h-[95vh] max-w-[98%] overflow-hidden">
            <div className="flex justify-end mb-2">
              <button
                onClick={() => setOpen(false)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Close
              </button>
            </div>
            <DrivePreview embedLink={doc.embedLink} height="90vh" width="100%" />
          </div>
        </div>
      )}
    </div>
  );
}
