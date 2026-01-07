import { ref } from 'vue';

// Exporterar reaktiva variabler för om användaren är autentisierad och användarroll
export const isAuthenticated = ref(!!localStorage.getItem('token'));
export const userRole = ref(localStorage.getItem('role'));

// Funktioner för att sätta autetifiering
export const setAuth = (token, role) => {
  localStorage.setItem('token', token);
  localStorage.setItem('role', role);
  isAuthenticated.value = true;
  userRole.value = role;
};

// Funktion för att rensa autetifiering
export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  isAuthenticated.value = false;
  userRole.value = null;
};
