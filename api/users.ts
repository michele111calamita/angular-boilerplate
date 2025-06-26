let utenti: { name: string; email: string }[] = [];

export default function handler(req: any, res: any) {
  if (req.method === 'POST') {
    try {
      const { users } = req.body;

      if (!Array.isArray(users)) {
        return res.status(400).json({ error: 'Payload non valido' });
      }

      utenti = users;
      return res.status(200).json({ success: true });
    } catch (e) {
      return res.status(500).json({ error: 'Errore interno POST' });
    }
  }

  if (req.method === 'GET') {
    return res.status(200).json(utenti);
  }

  res.status(405).json({ error: `Metodo ${req.method} non permesso` });
}
