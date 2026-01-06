<script setup>
    import { RouterView, RouterLink } from 'vue-router';
</script>

<template>
  <nav>
    <ul>
      <li><RouterLink to="/">Startsida</RouterLink></li>
      <li><RouterLink to="/products">Produkter</RouterLink></li>
      <li><RouterLink to="/login">Login</RouterLink></li>
    </ul>
  </nav>
</template>

<style scoped></style>