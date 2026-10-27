const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..', 'public');
const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
};
const port = Number(process.env.PORT || 8080);

http.createServer((request, response) => {
  const pathname = new URL(request.url, 'http://localhost').pathname;
  const requestedFile = pathname === '/' ? 'index.html' : pathname.slice(1);
  const filePath = path.resolve(root, requestedFile);
  if (!filePath.startsWith(`${root}${path.sep}`) && filePath !== path.join(root, 'index.html')) {
    response.writeHead(403).end('Forbidden');
    return;
  }
  fs.readFile(filePath, (error, content) => {
    if (error) {
      response.writeHead(error.code === 'ENOENT' ? 404 : 500).end('Not found');
      return;
    }
    response.writeHead(200, {
      'Content-Type': contentTypes[path.extname(filePath)] || 'application/octet-stream',
      'X-Content-Type-Options': 'nosniff',
    });
    response.end(content);
  });
}).listen(port, '127.0.0.1', () => {
  console.log(`Student Task Manager available at http://127.0.0.1:${port}`);
});
