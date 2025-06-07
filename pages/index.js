// File: pages/index.js
 import { useEffect, useState } from 'react';
-import DocumentCard from '../components/DocumentCard';
+import DocumentCard from '../components/DocumentCard';

 export default function Home() {
   const [docs, setDocs] = useState([]);

   useEffect(() => {
-    fetch('/api/docs')
+    fetch('/docs.json')
       .then(res => {
         if (!res.ok) throw new Error('Failed to load docs.json');
         return res.json();
       })
       .then(data => {
-        // if data isn’t an array this will error
+        // ensure it’s an array before setting
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
     return <p className="p-4">No documents found. Check that <code>public/docs.json</code> exists and is valid JSON.</p>;
   }

   return (
     <div className="p-4">
       <h1 className="text-3xl font-bold mb-6">Document Library</h1>
-      {docs.map((doc, idx) => (
+      {docs.map((doc, idx) => (
         <DocumentCard key={idx} doc={doc} />
       ))}
     </div>
   );
 }
