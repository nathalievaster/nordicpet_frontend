<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container">
      <!-- Logo / Brand -->
      <RouterLink class="navbar-brand" to="/">Nordicpet</RouterLink>

      <!-- Toggle knapp för mobil -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Navigeringslänkar -->
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <!-- Start (endast inloggad) -->
          <li class="nav-item" v-if="loggedIn">
            <RouterLink class="nav-link" to="/">Start</RouterLink>
          </li>

          <!-- Produkter (endast inloggad) -->
          <li class="nav-item" v-if="loggedIn">
            <RouterLink class="nav-link" to="/products">Produkter</RouterLink>
          </li>

          <!-- Kategorier (endast admin) -->
          <li class="nav-item" v-if="loggedIn && role === 'admin'">
            <RouterLink class="nav-link" to="/categories">Kategorier</RouterLink>
          </li>

          <!-- Logga in (om ej inloggad) -->
          <li class="nav-item" v-if="!loggedIn">
            <RouterLink class="nav-link btn btn-outline-primary ms-2" to="/login">
              Logga in
            </RouterLink>
          </li>

          <!-- Logga ut (om inloggad) -->
          <li class="nav-item" v-if="loggedIn">
            <button class="btn btn-danger ms-2" @click="handleLogout">Logga ut</button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { isAuthenticated, userRole, clearAuth } from '@/api/navAuth';

const router = useRouter();

// Reaktiva variabler för inloggningsstatus och användarroll
const loggedIn = isAuthenticated;
const role = userRole;

const handleLogout = () => {
  clearAuth();
  router.push('/login');
};
</script>


<style scoped>
</style>
