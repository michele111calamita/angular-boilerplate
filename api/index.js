// This file enforces correct MIME types
module.exports = (req, res) => {
  if (req.url.endsWith('.js')) {
    res.setHeader('Content-Type', 'application/javascript');
  } else if (req.url.endsWith('.css')) {
    res.setHeader('Content-Type', 'text/css');
  } else if (req.url.endsWith('.html')) {
    res.setHeader('Content-Type', 'text/html');
  }
  // Continue with normal handling
  return res;
};
