<script setup>
import { ref, onMounted } from 'vue';
import { apiFetch } from '@/api/api';

// State
const categories = ref([]);
const loading = ref(false);
const error = ref(null);

// Edit state
const editingCategoryId = ref(null);

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

// Skapa / uppdatera kategori
const saveCategory = async () => {
  if (!form.value.name) {
    error.value = 'Kategorin måste ha ett namn';
    return;
  }

  try {
    if (editingCategoryId.value) {
      // UPDATE
      await apiFetch(`/categories/${editingCategoryId.value}`, {
        method: 'PATCH',
        body: JSON.stringify(form.value)
      });
    } else {
      // CREATE
      await apiFetch('/categories', {
        method: 'POST',
        body: JSON.stringify(form.value)
      });
    }

    resetForm();
    await fetchCategories();
  } catch (err) {
    error.value = err?.error || 'Kunde inte spara kategori';
  }
};

// Starta redigering
const editCategory = (category) => {
  editingCategoryId.value = category.id;
  form.value.name = category.name;
  form.value.description = category.description || '';
};

// Avbryt redigering
const resetForm = () => {
  editingCategoryId.value = null;
  form.value.name = '';
  form.value.description = '';
  error.value = null;
};

// Ta bort kategori
const deleteCategory = async (id) => {
  if (!confirm('Är du säker på att du vill ta bort kategorin?')) return;
  
  try {
    await apiFetch(`/categories/${id}`, {
      method: 'DELETE'
    });
    await fetchCategories();
  } catch (err) {
    error.value =
      err?.error || 'Kunde inte ta bort kategori (har den produkter?)';
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
        Hantera produktkategorier i NordicPets sortiment.
      </p>
    </header>

    <!-- Form -->
    <section class="mb-5">
      <h2 class="h4 mb-3">
        {{ editingCategoryId ? 'Redigera kategori' : 'Skapa ny kategori' }}
      </h2>

      <form @submit.prevent="saveCategory" class="card p-4 shadow-sm">
        <div class="mb-3">
          <label class="form-label">Namn</label>
          <input v-model="form.name" class="form-control" />
        </div>

        <div class="mb-3">
          <label class="form-label">Beskrivning</label>
          <textarea
            v-model="form.description"
            class="form-control"
            rows="3"
          ></textarea>
        </div>

        <div class="d-flex gap-2">
          <button class="btn btn-success">
            {{ editingCategoryId ? 'Spara ändringar' : 'Skapa kategori' }}
          </button>

          <button
            v-if="editingCategoryId"
            type="button"
            class="btn btn-secondary"
            @click="resetForm"
          >
            Avbryt
          </button>
        </div>

        <p v-if="error" class="text-danger mt-2">
          {{ error }}
        </p>
      </form>
    </section>

    <!-- Lista -->
    <section>
      <h2 class="h4 mb-3">Befintliga kategorier</h2>

      <p v-if="loading">Laddar...</p>

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

            <div class="btn-group">
              <button
                class="btn btn-sm btn-outline-primary"
                @click="editCategory(category)"
              >
                Redigera
              </button>
              <button
                class="btn btn-sm btn-outline-danger"
                @click="deleteCategory(category.id)"
              >
                Ta bort
              </button>
            </div>
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