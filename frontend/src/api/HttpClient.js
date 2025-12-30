const API_URL = "https://localhost:7078/api";

function getAuthHeader() {
  const token = localStorage.getItem("token");
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}

export async function Get(endpoint) {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      headers: getAuthHeader(),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`GET ${endpoint} failed:`, res.status, errorText);
      throw new Error(`HTTP Get error! Status: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error(`GET ${endpoint} error:`, error);
    throw error;
  }
}

export async function Post(endpoint, body) {
  try {
    console.log(`POST ${endpoint}`, body); // Debug log

    const res = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`POST ${endpoint} failed:`, res.status, errorText);
      throw new Error(`HTTP Create error! Status: ${res.status}`);
    }

    const data = await res.json();
    console.log(`POST ${endpoint} success:`, data); // Debug log
    return data;
  } catch (error) {
    console.error(`POST ${endpoint} error:`, error);
    throw error;
  }
}

export async function Put(endpoint, body) {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`PUT ${endpoint} failed:`, res.status, errorText);
      throw new Error(`HTTP Put error! Status: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error(`PUT ${endpoint} error:`, error);
    throw error;
  }
}

export async function Delete(endpoint) {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: "DELETE",
      headers: { ...getAuthHeader() },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`DELETE ${endpoint} failed:`, res.status, errorText);
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error(`DELETE ${endpoint} error:`, error);
    throw error;
  }
}
