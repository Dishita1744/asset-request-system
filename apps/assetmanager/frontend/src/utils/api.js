// Central API utility
// Uses RELATIVE paths (/api/...) so all requests go through the Vite proxy
// (localhost:5173 → localhost:8000). This avoids CORS issues and ensures
// session cookies are always sent correctly.

export const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

// Frappe sets a cookie named 'csrftoken' after login.
// For POST/PUT/DELETE we must send it as the X-Frappe-CSRF-Token header.
export function getCSRFToken() {
  const match = document.cookie
    .split('; ')
    .find(row => row.startsWith('csrftoken='))
  return match ? decodeURIComponent(match.split('=')[1]) : 'fetch'
}

export async function getLoggedUser() {
  const res = await fetch('/api/method/frappe.auth.get_logged_user', {
    credentials: 'include',
  })
  if (!res.ok) return 'Guest'
  const data = await res.json()
  return data.message || 'Guest'
}

export async function apiGet(path) {
  const res = await fetch(path, {
    credentials: 'include',
  })
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`)
  return res.json()
}

export async function apiPost(path, body) {
  const res = await fetch(path, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Frappe-CSRF-Token': getCSRFToken(),
    },
    body: JSON.stringify(body),
  })
  return { ok: res.ok, status: res.status, data: await res.json() }
}
