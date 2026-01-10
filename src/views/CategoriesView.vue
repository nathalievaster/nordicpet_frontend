<script setup>
import { ref, onMounted } from 'vue';
import { apiFetch } from '@/api/api';

// State
const categories = ref([]);
const loading = ref(false);
const error = ref(null);

// Form
const form = ref({
  name: '',
  description: ''
});

// Hämta kategorier
const fetchCategories = async () => {
  loading.value = true;
  error.value = null;

  try {
    categories.value = await apiFetch('/categories');
  } catch (err) {
    error.value = err?.error || 'Kunde inte hämta kategorier';
  } finally {
    loading.value = false;
  }
};

// Skapa kategori
const createCategory = async () => {
  if (!form.value.name) {
    error.value = 'Kategorin måste ha ett namn';
    return;
  }

  try {
    await apiFetch('/categories', {
      method: 'POST',
      body: JSON.stringify(form.value)
    });

    // Rensa formulär
    form.value.name = '';
    form.value.description = '';

    // Uppdatera listan
    await fetchCategories();
  } catch (err) {
    error.value = err?.error || 'Kunde inte skapa kategori';
  }
};

// Kör vid mount
onMounted(fetchCategories);
</script>

<template>
  <main class="container mt-4">
    <header class="mb-4">
      <h1>Kategorier</h1>

      <p class="lead">
        Här hanterar du produktkategorier i NordicPets sortiment.
      </p>
    </header>

    <!-- Skapa kategori -->
    <section class="mb-5">
      <h2 class="h4 mb-3">Skapa ny kategori</h2>

      <form @submit.prevent="createCategory" class="card p-4 shadow-sm">
        <div class="mb-3">
          <label class="form-label">Namn</label>
          <input
            v-model="form.name"
            class="form-control"
            placeholder="Ex. Hund, Katt, Smådjur"
          />
        </div>

        <div class="mb-3">
          <label class="form-label">Beskrivning</label>
          <textarea
            v-model="form.description"
            class="form-control"
            rows="3"
            placeholder="Valfri beskrivning"
          ></textarea>
        </div>

        <button class="btn btn-success">
          Skapa kategori
        </button>

        <p v-if="error" class="text-danger mt-2">
          {{ error }}
        </p>
      </form>
    </section>

    <!-- Lista kategorier -->
    <section>
      <h2 class="h4 mb-3">Befintliga kategorier</h2>

      <p v-if="loading">Laddar kategorier...</p>

      <article v-else class="card shadow-sm">
        <ul class="list-group list-group-flush">
          <li
            v-for="category in categories"
            :key="category.id"
            class="list-group-item d-flex justify-content-between align-items-center"
          >
            <div>
              <strong>{{ category.name }}</strong>
              <p v-if="category.description" class="mb-0 text-muted">
                {{ category.description }}
              </p>
            </div>

            <span class="badge bg-secondary">
              {{ category.products.length }} produkter
            </span>
          </li>
        </ul>
      </article>
    </section>
  </main>
</template>


<style scoped>
  main {
    max-width: 900px;
    margin: 0 auto;
  }
</style>