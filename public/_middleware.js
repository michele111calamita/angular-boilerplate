// This middleware ensures correct MIME types are applied to all files
export default function middleware(request, event) {
  const response = event.next();
  const url = request.nextUrl.pathname;

  // Match any JS files including those with hash in filename (like runtime.hash.js)
  if (url.match(/\.js$/)) {
    response.headers.set('Content-Type', 'application/javascript');
  } else if (url.match(/\.mjs$/)) {
    response.headers.set('Content-Type', 'application/javascript');
  } else if (url.match(/\.js\.map$/)) {
    response.headers.set('Content-Type', 'application/json');
  } else if (url.match(/\.css$/)) {
    response.headers.set('Content-Type', 'text/css');
  } else if (url.match(/\.html$/)) {
    response.headers.set('Content-Type', 'text/html');
  }
  
  // Specific handling for Angular module files
  if (url.match(/runtime.*\.js$/) || 
      url.match(/polyfills.*\.js$/) || 
      url.match(/main.*\.js$/)) {
    response.headers.set('Content-Type', 'application/javascript');
    response.headers.set('Cache-Control', 'public, max-age=31536000');
  }
  
  return response;
}
