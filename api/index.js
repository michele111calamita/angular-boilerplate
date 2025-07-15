// This file enforces correct MIME types
module.exports = (req, res) => {
  // Match any JS files including those with hash in filename (like runtime.hash.js)
  if (req.url.match(/\.js(\?.*)?$/)) {
    res.setHeader('Content-Type', 'application/javascript');
  } else if (req.url.match(/\.mjs(\?.*)?$/)) {
    res.setHeader('Content-Type', 'application/javascript');
  } else if (req.url.match(/\.js\.map(\?.*)?$/)) {
    res.setHeader('Content-Type', 'application/json');
  } else if (req.url.match(/\.css(\?.*)?$/)) {
    res.setHeader('Content-Type', 'text/css');
  } else if (req.url.match(/\.html(\?.*)?$/)) {
    res.setHeader('Content-Type', 'text/html');
  }
  
  // Specific handling for Angular module files
  if (req.url.match(/runtime.*\.js(\?.*)?$/) || 
      req.url.match(/polyfills.*\.js(\?.*)?$/) || 
      req.url.match(/main.*\.js(\?.*)?$/)) {
    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Cache-Control', 'public, max-age=31536000');
  }
  
  // Continue with normal handling
  return res;
};
