// Bara bas-url så jag lätt kan slänga på endpoints
const BASE_URL = 'http://localhost:3000';

// Exporterar fetchen för anrop till backend
export const apiFetch = async (endpoint, options = {}) => { // options för att kunna skicka med metod, body etc (om det behövs)
    // Hämtar token från localstorage om den finns
  const token = localStorage.getItem('token');

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    // Sätter headers och lägger till Authorization header OM token finns
    headers: {
      'Content-Type': 'application/json',
      // Spread operator för att bara lägga till Authorization om token existerar
      ...(token && { Authorization: `Bearer ${token}` })
    },
    // Spread operator för att lägga till andra options som skickas med (om det behövs)
    ...options
  });

  // Läs body som JSON
  let data;
  try {
    data = await res.json();
  } catch (e) {
    data = null;
  }

  // Kasta bara om res.ok är false
  if (!res.ok) {
    throw data || { error: 'API error' };
  }

  return data; // Här kommer data.user att finnas
};