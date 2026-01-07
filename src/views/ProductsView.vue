<template>
    <h1 class="mb-4">Produkter</h1>

    <!-- Inga produkter -->
    <div v-if="!loading && products.length === 0" class="alert alert-warning">
      Inga produkter hittades
    </div>

    <!-- Produktlista -->
    <div class="row m-4" v-if="!loading && products.length">
      <div
        class="col-md-4 mb-3"
        v-for="product in products"
        :key="product.id"
      >
        <div class="card h-100">
          <img
            v-if="product.imageUrl"
            :src="product.imageUrl"
            class="card-img-top"
            alt="Produktbild"
          />

          <div class="card-body">
            <h5 class="card-title">{{ product.name }}</h5>
            <p class="card-text">{{ product.description }}</p>
            <p class="fw-bold">{{ product.price }} kr</p>
          </div>

          <!-- Admin-funktioner, bygger på senare -->
          <div class="card-footer" v-if="isAdmin">
            <button class="btn btn-sm btn-outline-primary me-2">
              Redigera
            </button>
            <button class="btn btn-sm btn-outline-danger">
              Ta bort
            </button>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { apiFetch } from '@/api/api';
import { userRole } from '@/api/navAuth';

// State
const products = ref([]);
const loading = ref(false);
const error = ref(null);

// Roll
const isAdmin = computed(() => userRole.value === 'admin');

// Hämta produkter
const fetchProducts = async () => {
  loading.value = true;
  error.value = null;

  try {
    products.value = await apiFetch('/products');
  } catch (err) {
    error.value = err?.error || 'Kunde inte hämta produkter';
  } finally {
    loading.value = false;
  }
};

// Kör vid mount
onMounted(fetchProducts);
</script>

<style scoped>
.card-img-top {
  height: 200px;
  object-fit: cover;
}


</style>