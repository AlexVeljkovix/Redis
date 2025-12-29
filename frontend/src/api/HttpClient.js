const API_URL = "https://localhost:7078/api";

function getAuthHeader() {
  const token = localStorage.getItem("token");
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}

export async function Get(endpoint) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: getAuthHeader(),
  });
  if (!res.ok) throw new Error(`HTTP Get error! Status: ${res.status}`);
  return res.json();
}

export async function Post(endpoint, body) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`HTTP Create error! Status: ${res.status}`);
  return res.json();
}

export async function Put(endpoint, body) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`HTTP Put error! Status: ${res.status}`);
  return res.json();
}

export async function Delete(endpoint) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: "DELETE",
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
  return res.json();
}
