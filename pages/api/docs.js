// File: pages/api/docs.js
import { promises as fs } from 'fs';
import { join } from 'path';

export default async function handler(req, res) {
  try {
    const filePath = join(process.cwd(), 'data', 'docs.json');
    const contents = await fs.readFile(filePath, 'utf8');
    const docs = JSON.parse(contents);
    res.status(200).json(docs);
  } catch (err) {
    console.error('Error reading docs.json:', err);
    res.status(500).json({ error: 'Could not load documents.' });
  }
}
