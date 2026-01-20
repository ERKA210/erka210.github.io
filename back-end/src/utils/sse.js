import crypto from "crypto";

const clients = new Map();

// sse browser рүү event илгээх
function writeEvent(res, event, data) {
  res.write(`event: ${event}\n`);
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}
// sse client buyu browsert id onooj server deer hadglna
export function registerSseClient(res, { userId, role }) {
  const id = crypto.randomUUID();
  clients.set(id, { res, userId, role });
  writeEvent(res, "connected", { ok: true, ts: Date.now() });
  return id;
}
// browser tab haahd holboltyg slgna
export function removeSseClient(id) {
  clients.delete(id);
}
// tuhain zahialgatai holbootoi status ni uurclgdhd hvrggch zhialgch ru ilgne inghde buh clientiig dwtna
export function broadcastOrderEvent({ event, orderId, status, courierId, customerId }) {
  const data = { orderId, status, courierId, customerId, ts: Date.now() };
  for (const client of clients.values()) {
    if (
      client.userId === customerId ||
      client.userId === courierId
    ) {
      sendEvent(client.res, event, data);
    }
  }
}
