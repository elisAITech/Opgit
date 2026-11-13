import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));

async function startServer() {
  const child = spawn(process.execPath, ['server.js'], {
    cwd: root,
    env: { ...process.env, HOST: '127.0.0.1', PORT: '0' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  let diagnostics = '';
  child.stderr.setEncoding('utf8');
  child.stderr.on('data', chunk => { diagnostics += chunk; });

  const baseUrl = await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error(`Server startup timed out: ${diagnostics}`)), 5000);
    const finish = (fn, value) => { clearTimeout(timeout); fn(value); };
    child.once('error', error => finish(reject, error));
    child.once('exit', code => finish(reject, new Error(`Server exited with code ${code}: ${diagnostics}`)));
    child.stdout.setEncoding('utf8');
    child.stdout.on('data', chunk => {
      const match = chunk.match(/FolderLab running at (http:\/\/127\.0\.0\.1:\d+)/);
      if (match) finish(resolve, match[1]);
    });
  }).catch(error => {
    child.kill();
    throw error;
  });

  return {
    baseUrl,
    async close() {
      if (child.exitCode !== null || child.signalCode !== null) return;
      child.kill('SIGTERM');
      await once(child, 'exit');
    },
  };
}

test('serves public HTML and JavaScript with correct MIME types', async t => {
  const server = await startServer();
  t.after(() => server.close());

  const page = await fetch(server.baseUrl + '/');
  assert.equal(page.status, 200);
  assert.match(page.headers.get('content-type'), /^text\/html/);
  assert.match(await page.text(), /<!doctype html>/i);

  const script = await fetch(server.baseUrl + '/src/model.js');
  assert.equal(script.status, 200);
  assert.match(script.headers.get('content-type'), /^text\/javascript/);
  assert.match(script.headers.get('x-content-type-options'), /nosniff/);

  const head = await fetch(server.baseUrl + '/', { method: 'HEAD' });
  assert.equal(head.status, 200);
  assert.equal(await head.text(), '');
});

test('rejects unsupported methods and nonexistent or hidden files', async t => {
  const server = await startServer();
  t.after(() => server.close());

  const post = await fetch(server.baseUrl + '/', { method: 'POST' });
  assert.equal(post.status, 405);
  assert.equal(post.headers.get('allow'), 'GET, HEAD');

  assert.equal((await fetch(server.baseUrl + '/missing.js')).status, 404);
  assert.equal((await fetch(server.baseUrl + '/unknown.txt')).status, 404);
  assert.equal((await fetch(server.baseUrl + '/.git/config.js')).status, 403);
  assert.equal((await fetch(server.baseUrl + '/%ZZ')).status, 400);
});
