/**
 * Tiny local SSE server that emits contract-shaped telemetry events, for
 * testing the REAL EventSource path (as opposed to the in-hook mock mode).
 *
 *   node scripts/mock-sse.mjs                 # listens on :8787
 *   NEXT_PUBLIC_TELEMETRY_URL=http://localhost:8787/events npm run dev
 *
 * Kill it mid-session to watch the hero degrade to "reconnecting…" and
 * recover when restarted (native EventSource retry).
 *
 * The JSON shape below IS the contract with the Rust backend
 * (lib/telemetry-types.ts / backend/src/sanitizer.rs).
 */
import http from 'node:http';

const PORT = process.env.PORT ?? 8787;

const EVENTS = [
  { source: 'CAPI Bridge', types: ['Purchase Captured', 'Event Relayed'] },
  { source: 'Spend → Sheets', types: ['Spend Synced', 'Row Updated'] },
  { source: 'Sample Automation', types: ['Sample Requested', 'Sample Shipped'] },
];

const randomEvent = () => {
  const bucket = EVENTS[Math.floor(Math.random() * EVENTS.length)];
  return {
    event_type: bucket.types[Math.floor(Math.random() * bucket.types.length)],
    source: bucket.source,
    timestamp: new Date().toISOString().replace(/\.\d{3}Z$/, 'Z'),
  };
};

const clients = new Set();

http
  .createServer((req, res) => {
    if (!req.url?.startsWith('/events')) {
      res.writeHead(404).end();
      return;
    }
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      // Dev-only wildcard; the Rust backend locks this to ALLOWED_ORIGIN.
      'Access-Control-Allow-Origin': '*',
    });
    // Replay-ish hello so the hero isn't empty on connect.
    res.write(`data: ${JSON.stringify(randomEvent())}\n\n`);
    clients.add(res);
    req.on('close', () => clients.delete(res));
  })
  .listen(PORT, () => console.log(`mock SSE on http://localhost:${PORT}/events`));

const emit = () => {
  const payload = `data: ${JSON.stringify(randomEvent())}\n\n`;
  for (const res of clients) res.write(payload);
  setTimeout(emit, 2000 + Math.random() * 4000);
};
emit();

setInterval(() => {
  for (const res of clients) res.write(': keep-alive\n\n');
}, 15000);
