const BASE = '/api';

async function handle(res) {
  const text = await res.text();
  let body;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = { error: text };
  }
  if (!res.ok) {
    const msg = body?.error || body?.errors?.join?.('; ') || res.statusText;
    throw new Error(msg || `Error ${res.status}`);
  }
  return body;
}

export async function getPolizas() {
  const res = await fetch(`${BASE}/polizas`);
  return handle(res);
}

export async function getPoliza(id) {
  const res = await fetch(`${BASE}/polizas/${encodeURIComponent(id)}`);
  return handle(res);
}

export async function postPoliza(datos) {
  const res = await fetch(`${BASE}/polizas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  });
  return handle(res);
}

export async function putPoliza(id, datos) {
  const res = await fetch(`${BASE}/polizas/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  });
  return handle(res);
}

export async function deletePoliza(id) {
  const res = await fetch(`${BASE}/polizas/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
  if (res.status === 204) {
    await res.text();
    return;
  }
  return handle(res);
}

export async function getEstadisticas(params) {
  const q = new URLSearchParams(params);
  const res = await fetch(`${BASE}/estadisticas?${q}`);
  return handle(res);
}
