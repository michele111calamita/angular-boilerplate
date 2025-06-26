import { VercelRequest, VercelResponse } from '@vercel/node';

// ✅ Variabile in memoria (solo per test/demo)
let utenti: any[] = [];

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    const { users } = req.body;

    if (!Array.isArray(users)) {
      return res.status(400).json({ error: 'Invalid payload' });
    }

    utenti = users;
    return res.status(200).json({ success: true });
  }

  if (req.method === 'GET') {
    return res.status(200).json(utenti);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
