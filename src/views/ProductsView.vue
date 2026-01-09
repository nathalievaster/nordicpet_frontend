<template>
    <h1 class="mb-4">Produkter</h1>

    <button
        v-if="isAdmin"
        class="btn btn-success"
        @click="toggleForm"
        title="Lägg till produkt"
      >Lägg till produkt</button>

          <!-- Produktform (admin only) -->
    <div v-if="showForm && isAdmin">
        <h2>Lägg till produkt</h2>

        <form @submit.prevent="createProduct">
          <div class="mb-2">
            <label for="name" class="form-label">Namn</label>
            <input v-model="form.name" class="form-control" placeholder="Namn" />
          </div>

          <div class="mb-2">
            <label for="description" class="form-label">Beskrivning</label>
            <input v-model="form.description" class="form-control" placeholder="Beskrivning" />
          </div>

          <div class="mb-2">
            <label for="price" class="form-label ">Pris</label>
            <input v-model.number="form.price" type="number" class="form-control" placeholder="Pris" />
          </div>

          <div class="mb-2">
            <label for="imageUrl" class="form-label">Bild-URL</label>
            <input v-model="form.imageUrl" class="form-control" placeholder="Bild-URL" />
          </div>

          <div class="mb-2">
            <label for="categoryId" class="form-label">Kategori</label>
            <select
            v-model.number="form.categoryId"
            class="form-select"
            required>
            <option disabled value="">Välj kategori</option>

    <option
      v-for="category in categories"
      :key="category.id"
      :value="category.id"
    >
      {{ category.name }}
    </option>
  </select>
</div>

          <div class="mb-2">
            <label for="quantity" class="form-label">Antal</label>
            <input v-model.number="form.quantity" type="number" class="form-control" placeholder="Antal" />
          </div>

          <button class="btn btn-primary">Spara</button>
        </form>
      </div>

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
import { ref, computed, onMounted } from 'vue';
import { apiFetch } from '@/api/api';
import { userRole } from '@/api/navAuth';

// State
const products = ref([]);
const categories = ref([]);
const loading = ref(false);
const error = ref(null);
const showForm = ref(false);

// Form
const form = ref({
  name: '',
  description: '',
  price: 0,
  imageUrl: '',
  categoryId: '',
  quantity: 0
});

// Roll
const isAdmin = computed(() => userRole.value === 'admin');

// Hämta produkter
const fetchProducts = async () => {
  loading.value = true;
  try {
    products.value = await apiFetch('/products');
  } catch (err) {
    error.value = err?.error || 'Kunde inte hämta produkter';
  } finally {
    loading.value = false;
  }
};

// Hämta kategorier
const fetchCategories = async () => {
  try {
    categories.value = await apiFetch('/categories');
  } catch (err) {
    console.error('Kunde inte hämta kategorier', err);
  }
};


// Toggle formulär
const toggleForm = () => {
  // Visa/dölj formulär
  showForm.value = !showForm.value;
};

// Skapa produkt
const createProduct = async () => {
  try {
    await apiFetch('/products', {
      method: 'POST',
      body: JSON.stringify(form.value)
    });

    // Återställ formulär
    showForm.value = false;
    await fetchProducts();
  } catch (err) {
    alert(err?.error || 'Kunde inte skapa produkt');
  }
};

onMounted(() => {
  fetchProducts();
  fetchCategories();
});

</script>

<style scoped>
.card-img-top {
  height: 200px;
  object-fit: cover;
}

form {
  max-width: 600px;
  margin: 0 auto;
}

label {
  font-weight: bold;
  margin: 0 auto;
  margin-bottom: 0.5rem;
}

h2 {
  text-align: center;
}

input {
  margin-bottom: 1rem;
}

form button {
  margin-top: 1.5em;
}
</style>