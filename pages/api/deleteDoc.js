// File: pages/api/deleteDoc.js
import { promises as fs } from 'fs';
import { join } from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { secret, id } = req.body;
  if (secret !== process.env.NEXT_PUBLIC_ADMIN_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const filePath = join(process.cwd(), 'data', 'docs.json');
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    let docs = JSON.parse(raw);

    const beforeCount = docs.length;
    docs = docs.filter(doc => doc.id !== id);

    if (docs.length === beforeCount) {
      return res.status(404).json({ error: 'Document not found' });
    }

    await fs.writeFile(filePath, JSON.stringify(docs, null, 2), 'utf8');
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Error deleting doc:', err);
    return res.status(500).json({ error: 'Could not delete document.' });
  }
}
