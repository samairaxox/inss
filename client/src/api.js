// One small fetch wrapper for the whole app.
// Usage: const items = await api.get('/items?q=abc');
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// The logged-in user is saved in localStorage by AuthContext (key "user").
// DEMO ONLY: role and id are sent as headers; the server trusts them.
function buildHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (user) {
    headers['x-role'] = user.role;
    headers['x-user-id'] = user._id;
  }
  return headers;
}

async function request(method, path, body) {
  let res;
  try {
    res = await fetch(BASE_URL + path, {
      method,
      headers: buildHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error(`Cannot reach the API at ${BASE_URL}. Is the server running?`);
  }
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || `Request failed (${res.status})`);
  return data;
}

export const api = {
  get: (path) => request('GET', path),
  post: (path, body) => request('POST', path, body),
  put: (path, body) => request('PUT', path, body),
  del: (path) => request('DELETE', path),
};
