<template>
  <main class="container mt-4">
    <header class="mb-4 text-center">
      <h1>Produkter</h1>
      <button v-if="isAdmin" class="btn btn-success" @click="toggleForm" title="Lägg till produkt">
        Lägg till produkt
      </button>
    </header>

    <!-- Filter och sortering -->
    <section class="row mb-4">
      <div class="col-md-4">
        <label class="form-label">Filtrera på kategori</label>
        <select v-model="selectedCategory" class="form-select">
          <option value="">Alla kategorier</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
      </div>
    </section>

    <!-- Produktform (admin only) -->
    <section v-if="showForm && isAdmin" aria-label="Lägg till eller redigera produkt">
      <header>
        <h2>{{ editingProductId ? 'Redigera produkt' : 'Lägg till produkt' }}</h2>
      </header>

      <form @submit.prevent="editingProductId ? updateProduct() : createProduct()" class="card p-4 shadow mb-4">
        <fieldset>
          <!-- Namn -->
          <label class="form-label">Namn</label>
          <input v-model="form.name" class="form-control" />
          <p v-if="errors.name" class="text-danger mt-1 mb-0">
            {{ errors.name }}
          </p>

          <!-- Beskrivning -->
          <label class="form-label mt-3">Beskrivning</label>
          <input v-model="form.description" class="form-control" />
          <p v-if="errors.description" class="text-danger mt-1 mb-0">
            {{ errors.description }}
          </p>

          <!-- Pris -->
          <label class="form-label mt-3">Pris</label>
          <input type="number" v-model.number="form.price" class="form-control" />
          <p v-if="errors.price" class="text-danger mt-1 mb-0">
            {{ errors.price }}
          </p>

          <!-- Bild -->
          <label class="form-label mt-3">Bild</label>
          <input type="file" class="form-control" accept="image/*" @change="onFileChange" />

          <!-- Kategori -->
          <label class="form-label mt-3">Kategori</label>
          <select v-model.number="form.categoryId" class="form-select">
            <option disabled value="">Välj kategori</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
          <p v-if="errors.categoryId" class="text-danger mt-1 mb-0">
            {{ errors.categoryId }}
          </p>

          <!-- Antal -->
          <label class="form-label mt-3">Antal</label>
          <input type="number" v-model.number="form.quantity" class="form-control" />
          <p v-if="errors.quantity" class="text-danger mt-1 mb-0">
            {{ errors.quantity }}
          </p>

          <button type="submit" class="btn btn-primary mt-4">
            {{ editingProductId ? 'Uppdatera' : 'Spara' }}
          </button>
        </fieldset>
      </form>
    </section>

    <!-- Inga produkter -->
    <section v-if="!loading && paginatedProducts.length === 0" class="alert alert-warning" role="status">
      Inga produkter hittades
    </section>

    <!-- Produktlista -->
    <section v-if="!loading && paginatedProducts.length" aria-label="Produktlista" class="row">
      <article v-for="product in paginatedProducts" :key="product.id" class="col-md-4 mb-3">
        <article class="card h-100">
          <img v-if="product.imageUrl" :src="`${API_BASE}${product.imageUrl}`" class="card-img" alt="Produktbild" />

          <div class="card-body">
            <h3 class="card-title">{{ product.name }}</h3>
            <p class="card-text">{{ product.description }}</p>
            <p class="fw-bold">{{ product.price }} kr</p>
            <div class="mt-3">
              <label class="form-label mb-1">Lagersaldo</label>

              <!-- VISNINGSLÄGE -->
              <div v-if="!inventoryEdit[product.id]?.editing" class="d-flex justify-content-between align-items-center">
                <span class="fw-bold">
                  {{ product.inventory?.quantity ?? 0 }} st
                </span>

                <button class="btn btn-sm btn-outline-primary" @click="startInventoryEdit(product)">
                  Ändra
                </button>
              </div>

              <!-- REDIGERINGSLÄGE -->
              <div v-else class="d-flex gap-2 align-items-center">
                <input type="number" class="form-control form-control-sm" style="max-width: 90px"
                  v-model.number="inventoryEdit[product.id].quantity" min="0"
                  @input="inventoryMessage[product.id] = ''" />

                <button class="btn btn-sm btn-success" @click="saveInventory(product.id)">
                  Spara
                </button>

                <button class="btn btn-sm btn-outline-secondary" @click="cancelInventoryEdit(product.id)">
                  Avbryt
                </button>

                <small v-if="inventoryMessage[product.id]" class="text-muted">
                  {{ inventoryMessage[product.id] }}
                </small>
              </div>
            </div>
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

    <!-- Paginering -->
    <nav v-if="totalPages > 1" class="d-flex justify-content-center mt-4">
      <ul class="pagination">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <button class="page-link" @click="currentPage--">Föregående</button>
        </li>

        <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: page === currentPage }">
          <button class="page-link" @click="currentPage = page">
            {{ page }}
          </button>
        </li>

        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <button class="page-link" @click="currentPage++">Nästa</button>
        </li>
      </ul>
    </nav>

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

const API_BASE = 'http://localhost:3000';

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

// Paginering
const currentPage = ref(1);
const itemsPerPage = 6;

// Filtrering
const selectedCategory = ref('');

// Ladda upp fil
const imageFile = ref(null);

const onFileChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  imageFile.value = file;
};

// Form
const form = ref({
  name: '',
  description: '',
  price: 0,
  categoryId: '',
  quantity: 0
});

// Validering av formulär
const errors = ref({});

const validateForm = () => {
  const newErrors = {};

  if (!form.value.name.trim()) {
    newErrors.name = 'Produktnamn måste anges';
  }

  if (!form.value.description.trim()) {
    newErrors.description = 'Beskrivning måste anges';
  }

  if (form.value.price <= 0) {
    newErrors.price = 'Pris måste vara större än 0';
  }

  if (!form.value.categoryId) {
    newErrors.categoryId = 'Du måste välja en kategori';
  }

  if (form.value.quantity < 0) {
    newErrors.quantity = 'Antal kan inte vara negativt';
  }

  errors.value = newErrors;
  return Object.keys(newErrors).length === 0;
};

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
    categoryId: '',
    quantity: 0
  };

  imageFile.value = null;
  errors.value = {};
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
  // Validera formulär
  if (!validateForm()) {
    return;
  }

  const formData = new FormData();

  for (const key in form.value) {
    formData.append(key, form.value[key]);
  }

  if (imageFile.value) {
    formData.append('image', imageFile.value);
  }

  try {
    await apiFetch('/products', {
      method: 'POST',
      body: formData
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
  // Validera formulär
  if (!validateForm()) {
    return;
  }

  const formData = new FormData();

  for (const key in form.value) {
    formData.append(key, form.value[key]);
  }

  if (imageFile.value) {
    formData.append('image', imageFile.value)
  }

  try {
    await apiFetch(`/products/${editingProductId.value}`, {
      method: 'PUT',
      body: formData
    });

    resetForm();
    await fetchProducts();
  } catch (err) {
    alert(err?.error || 'Kunde inte uppdatera produkt');
  }
};

// Justera lagersaldo
const inventoryEdit = ref({});

const startInventoryEdit = (product) => {
  inventoryEdit.value[product.id] = {
    editing: true,
    originalQuantity: product.inventory?.quantity ?? 0,
    quantity: product.inventory?.quantity ?? 0
  };
};

const cancelInventoryEdit = (productId) => {
  delete inventoryEdit.value[productId];
};

const inventoryMessage = ref({});

const saveInventory = async (productId) => {
  const entry = inventoryEdit.value[productId];

  const change = entry.quantity - entry.originalQuantity;

  if (change === 0) {
    inventoryMessage.value[productId] = 'Inga ändringar att spara';
    return;
  }

  try {
    await apiFetch(`/inventory/${productId}`, {
      method: 'PATCH',
      body: JSON.stringify({ change })
    });

    delete inventoryEdit.value[productId];
    await fetchProducts();
  } catch (err) {
    inventoryMessage.value[productId] =
      err?.error || 'Kunde inte uppdatera lagersaldo';
  }
};

// Filtrera produkter på kategori
const filteredProducts = computed(() => {
  if (!selectedCategory.value) {
    return products.value;
  }

  return products.value.filter(
    p => p.categoryId === Number(selectedCategory.value)
  );
});

// Totalt antal sidor
const totalPages = computed(() =>
  Math.ceil(filteredProducts.value.length / itemsPerPage)
);

// Produkter som visas på aktuell sida
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredProducts.value.slice(start, start + itemsPerPage);
});

onMounted(() => {
  fetchProducts();
  fetchCategories();
});

</script>

<style scoped>
.card-img {
  max-height: 300px;
  width: auto;
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