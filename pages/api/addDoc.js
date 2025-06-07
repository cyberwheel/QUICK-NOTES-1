// File: pages/api/addDoc.js
import { promises as fs } from 'fs';
import { join } from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { secret, fileLink, title, tags, category } = req.body;
  if (secret !== process.env.NEXT_PUBLIC_ADMIN_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Extract the fileId from the Drive URL
  const match = fileLink.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (!match) {
    return res.status(400).json({ error: 'Invalid Drive file link' });
  }
  const fileId = match[1];

  const filePath = join(process.cwd(), 'data', 'docs.json');
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    const docs = JSON.parse(raw);

    const embedLink = fileLink.includes('/preview')
      ? fileLink
      : fileLink.replace(/\/view.*/, '/preview');

    const newDoc = {
      id: Date.now().toString(),
      fileLink,
      fileId,
      title,
      tags: tags.split(',').map(t => t.trim().toLowerCase()),
      category,
      embedLink,
      addedAt: new Date().toISOString(),
    };

    docs.push(newDoc);
    await fs.writeFile(filePath, JSON.stringify(docs, null, 2), 'utf8');

    return res.status(200).json(newDoc);
  } catch (err) {
    console.error('Error writing docs.json:', err);
    return res.status(500).json({ error: 'Could not add document.' });
  }
}
