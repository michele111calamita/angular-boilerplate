export default function handler(req, res) {
    const auth = req.headers.authorization;
  
    if (!auth || !auth.startsWith('Basic ')) {
      res.setHeader('WWW-Authenticate', 'Basic realm=\"Protected Area\"');
      return res.status(401).end('Authentication required.');
    }
  
    const base64Credentials = auth.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');
  
    if (username === 'admin' && password === 'trasferta2025') {
      return res.status(200).end('Authenticated');
    }
  
    return res.status(403).end('Access Denied');
  }
  