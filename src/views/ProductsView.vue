<template>
  <main class="container mt-4">
    <header class="mb-4 text-center">
      <h1>Produkter</h1>
      <button v-if="isAdmin" class="btn btn-success" @click="toggleForm" title="Lägg till produkt">
        Lägg till produkt
      </button>
    </header>

    <!-- Produktform (admin only) -->
    <section v-if="showForm && isAdmin" aria-label="Lägg till eller redigera produkt">
      <header>
        <h2>{{ editingProductId ? 'Redigera produkt' : 'Lägg till produkt' }}</h2>
      </header>

      <form @submit.prevent="editingProductId ? updateProduct() : createProduct()" class="card p-4 shadow mb-4">
        <fieldset>
          <label for="name" class="form-label">Namn</label>
          <input id="name" v-model="form.name" class="form-control" placeholder="Namn" required />

          <label for="description" class="form-label">Beskrivning</label>
          <input id="description" v-model="form.description" class="form-control" placeholder="Beskrivning" required />

          <label for="price" class="form-label">Pris</label>
          <input id="price" v-model.number="form.price" type="number" class="form-control" placeholder="Pris"
            required />

          <label for="imageUrl" class="form-label">Bild-URL</label>
          <input id="imageUrl" v-model="form.imageUrl" class="form-control" placeholder="Bild-URL" />

          <label for="categoryId" class="form-label">Kategori</label>
          <select id="categoryId" v-model.number="form.categoryId" class="form-select" required>
            <option disabled value="">Välj kategori</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>

          <label for="quantity" class="form-label">Antal</label>
          <input id="quantity" v-model.number="form.quantity" type="number" class="form-control" placeholder="Antal" />

          <button type="submit" class="btn btn-primary mt-3">{{ editingProductId ? 'Uppdatera' : 'Spara' }}</button>
        </fieldset>
      </form>
    </section>

    <!-- Inga produkter -->
    <section v-if="!loading && products.length === 0" class="alert alert-warning" role="status">
      Inga produkter hittades
    </section>

    <!-- Produktlista -->
    <section v-if="!loading && products.length" aria-label="Produktlista" class="row">
      <article v-for="product in products" :key="product.id" class="col-md-4 mb-3">
        <article class="card h-100">
          <img v-if="product.imageUrl" :src="product.imageUrl" class="card-img-top" alt="Produktbild" />

          <div class="card-body">
            <h3 class="card-title">{{ product.name }}</h3>
            <p class="card-text">{{ product.description }}</p>
            <p class="fw-bold">{{ product.price }} kr</p>
          </div>

          <footer class="card-footer" v-if="isAdmin">
            <button class="btn btn-sm btn-outline-primary me-2" @click="startEdit(product)">
              Redigera
            </button>
            <button class="btn btn-sm btn-outline-danger" @click="openDeleteModal(product)">
              Ta bort
            </button>
          </footer>
        </article>
      </article>
    </section>


    <Confirm :show="showConfirm" title="Bekräfta borttagning" :message="`Vill du ta bort ${productToDelete?.name}?`"
      @confirm="confirmDelete" @cancel="showConfirm = false" />

    <aside v-if="showDeleteSuccess" class="toast toast-success">
      Produkten har tagits bort
    </aside>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { apiFetch } from '@/api/api';
import { userRole } from '@/api/navAuth';
import Confirm from '@/components/Confirm.vue';

// Ta bort produkt med en bekräftelsemodal
const productToDelete = ref(null);
const showConfirm = ref(false);
const showDeleteSuccess = ref(false);

const openDeleteModal = (product) => {
  productToDelete.value = product;
  showConfirm.value = true;
};

const confirmDelete = async () => {
  try {
    await apiFetch(`/products/${productToDelete.value.id}`, {
      method: 'DELETE'
    });

    showConfirm.value = false;
    productToDelete.value = null;
    showDeleteSuccess.value = true;
    await fetchProducts();

    setTimeout(() => showDeleteSuccess.value = false, 2000);
  } catch (err) {
    alert(err?.error || 'Kunde inte ta bort produkt');
  }
};

// State
const products = ref([]);
const categories = ref([]);
const editingProductId = ref(null);
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

// Redigera produkt och nolla formulär
const resetForm = () => {
  form.value = {
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    categoryId: '',
    quantity: 0
  };
  editingProductId.value = null;
  showForm.value = false;
};

const toggleForm = () => {
  if (showForm.value) {
    resetForm();
  } else {
    showForm.value = true;
  }
};

// Skapa produkt
const createProduct = async () => {
  try {
    await apiFetch('/products', {
      method: 'POST',
      body: JSON.stringify(form.value)
    });

    // Återställ formulär
    resetForm();
    await fetchProducts();
  } catch (err) {
    alert(err?.error || 'Kunde inte skapa produkt');
  }
};

// Redigera produkt
const startEdit = (product) => {
  editingProductId.value = product.id;
  showForm.value = true;

  form.value = {
    name: product.name,
    description: product.description,
    price: product.price,
    imageUrl: product.imageUrl,
    categoryId: product.categoryId,
    quantity: product.inventory?.quantity ?? 0
  };
};

const updateProduct = async () => {
  try {
    await apiFetch(`/products/${editingProductId.value}`, {
      method: 'PUT',
      body: JSON.stringify(form.value)
    });

    resetForm();
    await fetchProducts();
  } catch (err) {
    alert(err?.error || 'Kunde inte uppdatera produkt');
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

main {
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  text-align: center;
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