// Bara bas-url så jag lätt kan slänga på endpoints
const BASE_URL = 'https://nordicpets-backend.onrender.com';

// Exporterar fetchen för anrop till backend
export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');

  // Om body är FormData så sätts INTE Content-Type
  const isFormData = options.body instanceof FormData;

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token && { Authorization: `Bearer ${token}` })
    }
  });

  // Läs body som JSON (om möjligt)
  let data;
  try {
    data = await res.json();
  } catch (e) {
    data = null;
  }

  if (!res.ok) {
    throw data || { error: 'API error' };
  }

  return data;
};
