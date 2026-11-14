import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const host = process.env.HOST || '127.0.0.1';
const port = Number(process.env.PORT || 4173);
const mimeTypes = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript' };

const server = http.createServer(async (request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.writeHead(405, { Allow: 'GET, HEAD' }).end();
    return;
  }

  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  } catch {
    response.writeHead(400).end('Bad request');
    return;
  }

  const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
  const relative = path.relative(root, file);
  if (relative.startsWith('..') || path.isAbsolute(relative) ||
      relative.split(path.sep).some((segment) => segment.startsWith('.'))) {
    response.writeHead(403).end('Forbidden');
    return;
  }

  const extension = path.extname(file);
  if (!mimeTypes[extension]) {
    response.writeHead(404).end('Not found');
    return;
  }

  try {
    const content = await readFile(file);
    response.writeHead(200, {
      'Content-Type': mimeTypes[extension] + '; charset=utf-8',
      'X-Content-Type-Options': 'nosniff'
    });
    response.end(request.method === 'HEAD' ? undefined : content);
  } catch (error) {
    response.writeHead(['ENOENT', 'EISDIR'].includes(error.code) ? 404 : 500).end('Not found');
  }
});

server.listen(port, host, () => console.log('FolderLab running at http://' + host + ':' + server.address().port));
