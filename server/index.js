import http from 'node:http';
import { pathToFileURL } from 'node:url';
import { createPlan } from './service.js';
import { validateForm } from './planner.js';

export function makeServer({ planner = createPlan, port = 3001, frontendPort = 5173 } = {}) {
  const hosts = new Set([`127.0.0.1:${port}`, `localhost:${port}`, `127.0.0.1:${frontendPort}`, `localhost:${frontendPort}`, '127.0.0.1:4173', 'localhost:4173']);
  const origins = new Set([...hosts].map(h => `http://${h}`));
  let busy = false;
  let requests = [];
  const send = (res, status, data) => { res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' }); res.end(JSON.stringify(data)); };
  const server = http.createServer(async (req, res) => {
    const boundPort = server.address()?.port;
    const validHost = hosts.has(req.headers.host) || [`127.0.0.1:${boundPort}`, `localhost:${boundPort}`].includes(req.headers.host);
    if (!validHost || (req.headers.origin && !origins.has(req.headers.origin)) || req.headers['sec-fetch-site'] === 'cross-site') return send(res, 403, { error: 'Request origin is not allowed.' });
    if (req.url === '/api/health' && req.method === 'GET') return send(res, 200, { status: 'ok', model: process.env.OLLAMA_MODEL || null, pricingConfigured: Boolean(process.env.GROCERY_API_KEY) });
    if (req.url !== '/api/plan' || req.method !== 'POST') return send(res, 404, { error: 'Endpoint not found.' });
    if (!req.headers['content-type']?.startsWith('application/json')) return send(res, 415, { error: 'Send application/json.' });
    requests = requests.filter(t => Date.now() - t < 60000);
    if (requests.length >= 6 || busy) return send(res, 429, { error: 'A plan is already being prepared, or too many requests were sent. Please try again shortly.' });
    requests.push(Date.now());
    busy = true;
    try {
      let size = 0; const chunks = [];
      for await (const chunk of req) {
        size += chunk.length;
        if (size > 16000) { send(res, 413, { error: 'Form is too large.' }); return; }
        chunks.push(chunk);
      }
      let body;
      try { body = JSON.parse(Buffer.concat(chunks).toString('utf8')); validateForm(body); }
      catch (error) { return send(res, 400, { error: error instanceof SyntaxError ? 'Invalid JSON.' : error.message }); }
      try { send(res, 200, await planner(body)); }
      catch { send(res, 503, { error: 'Planning service unavailable. For reported prices, configure the backend API key and reviewed product mappings. You can also select sample prices.' }); }
    } catch {
      if (!res.headersSent && !res.destroyed) send(res, 400, { error: 'Request interrupted.' });
    } finally { busy = false; }
  });
  server.requestTimeout = 15000;
  server.headersTimeout = 10000;
  return server;
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const port = Number(process.env.API_PORT || 3001);
  makeServer({ port, frontendPort: Number(process.env.PORT || 5173) }).listen(port, '127.0.0.1', () => console.log(`Planning API: http://127.0.0.1:${port}`));
}
