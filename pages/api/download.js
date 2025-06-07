// File: pages/api/download.js

export const config = {
  api: {
    bodyParser: false,
    responseLimit: false,
  },
};

export default async function handler(req, res) {
  const { fileId } = req.query;
  if (!fileId) {
    res.status(400).end('Missing fileId');
    return;
  }

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    res.status(500).end('Missing GOOGLE_API_KEY');
    return;
  }

  // Use Drive v3 API to stream file bytes
  const driveUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${apiKey}`;

  try {
    const driveRes = await fetch(driveUrl);

    if (!driveRes.ok) {
      console.error('Drive API error:', await driveRes.text());
      res
        .status(driveRes.status)
        .end('Failed to fetch file from Drive API');
      return;
    }

    // Force download in browser
    res.writeHead(200, {
      'Content-Disposition': `attachment; filename="${fileId}.pdf"`,
      'Content-Type':
        driveRes.headers.get('content-type') ||
        'application/octet-stream',
    });

    // Stream directly
    const body = driveRes.body;
    if (!body) {
      res.status(500).end('No data from Drive API');
      return;
    }
    body.pipe(res);
  } catch (err) {
    console.error('Download proxy error:', err);
    res.status(500).end('Download proxy encountered an error');
  }
}
