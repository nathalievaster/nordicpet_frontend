<script setup>
import { ref, onMounted } from 'vue';
import { apiFetch } from '@/api/api';

// State
const categories = ref([]);
const loading = ref(false);
const error = ref(null);

const categoryToDelete = ref(null);
const showDeleteSuccess = ref(false);

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

const confirmDelete = async () => {
  try {
    await apiFetch(`/categories/${categoryToDelete.value.id}`, {
      method: 'DELETE'
    });

    categoryToDelete.value = null;
    showDeleteSuccess.value = true;
    await fetchCategories();

    // Auto-hide efter 2 sek
    setTimeout(() => {
      showDeleteSuccess.value = false;
    }, 2000);

  } catch (err) {
    alert(err?.error || 'Kunde inte ta bort kategori');
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
          <textarea v-model="form.description" class="form-control" rows="3"></textarea>
        </div>

        <div class="d-flex gap-2">
          <button class="btn btn-success">
            {{ editingCategoryId ? 'Spara ändringar' : 'Skapa kategori' }}
          </button>

          <button v-if="editingCategoryId" type="button" class="btn btn-secondary" @click="resetForm">
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
          <li v-for="category in categories" :key="category.id"
            class="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{{ category.name }}</strong>
              <p v-if="category.description" class="mb-0 text-muted">
                {{ category.description }}
              </p>
            </div>

            <div class="btn-group">
              <button class="btn btn-sm btn-outline-primary" @click="editCategory(category)">
                Redigera
              </button>
              <button class="btn btn-sm btn-outline-danger" @click="categoryToDelete = category">
                Ta bort
              </button>
            </div>
          </li>
        </ul>
      </article>
    </section>
  </main>

  <!-- Bekräfta borttagning-ruta -->
  <section v-if="categoryToDelete" class="confirm-overlay" role="alertdialog" aria-modal="true">
    <article class="confirm-box">
      <header class="confirm-header">
        <h2>Bekräfta borttagning</h2>
      </header>

      <p>
        Är du säker på att du vill ta bort
        <strong>{{ categoryToDelete.name }}</strong>?
      </p>

      <footer class="confirm-actions">
        <button type="button" class="btn btn-outline-secondary" @click="categoryToDelete = null">
          Nej
        </button>

        <button type="button" class="btn btn-danger" @click="confirmDelete">
          Ja, ta bort
        </button>
      </footer>
    </article>
  </section>

  <aside v-if="showDeleteSuccess" class="toast toast-success" role="status" aria-live="polite">
    <span class="toast-message">
      Kategorin har tagits bort
    </span>
  </aside>

</template>



<style scoped>
main {
  max-width: 900px;
  margin: 0 auto;
}

.confirm-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.confirm-box {
  background: #fff;
  padding: 1.5rem;
  border-radius: 10px;
  max-width: 420px;
  width: 100%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.confirm-header h2 {
  margin-bottom: 0.75rem;
  font-size: 1.25rem;
}

.confirm-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1.25rem;
}

.toast {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.95rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  z-index: 3000;
  animation: slideIn 0.3s ease-out;
}

.toast-success {
  background: #198754;
  color: #fff;
}

.toast-icon {
  font-weight: bold;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>