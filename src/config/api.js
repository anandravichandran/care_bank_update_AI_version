function joinUrl(base, path) {
  const trimmed = base.replace(/\/+$/, '');
  return path.startsWith('/') ? `${trimmed}${path}` : `${trimmed}/${path}`;
}

const AUTH_API_URL = import.meta.env.VITE_API_URL || 'https://carebankhost-1.onrender.com/api/auth';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://carebankhost-1.onrender.com/api';

async function safeFetchJson(url, options = {}) {
  const response = await fetch(url, options);
  const contentType = response.headers.get('content-type');
  let data;
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    const text = await response.text();
    throw new Error(text || `Request failed with status ${response.status}`);
  }
  if (!response.ok) {
    throw new Error(data.message || data.error || `Request failed with status ${response.status}`);
  }
  return data;
}

async function apiPost(path, body) {
  return safeFetchJson(joinUrl(API_BASE_URL, path), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

async function apiGet(path) {
  return safeFetchJson(joinUrl(API_BASE_URL, path));
}

async function apiUpload(path, formData) {
  const response = await fetch(joinUrl(API_BASE_URL, path), {
    method: 'POST',
    body: formData,
  });
  const contentType = response.headers.get('content-type');
  let data;
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    const text = await response.text();
    throw new Error(text || `Upload failed with status ${response.status}`);
  }
  if (!response.ok) {
    throw new Error(data.message || data.error || `Upload failed with status ${response.status}`);
  }
  return data;
}

async function authPost(path, body) {
  return safeFetchJson(joinUrl(AUTH_API_URL, path), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

export const api = {
  get: apiGet,
  post: apiPost,
  upload: apiUpload,
};

export const authApi = {
  post: authPost,
};

export { AUTH_API_URL, API_BASE_URL };