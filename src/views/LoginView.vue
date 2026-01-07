<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-4">
        <h1 class="text-center mb-4">Logga in</h1>

        <form @submit.prevent="login" class="card p-4 shadow">
          <!-- EMAIL -->
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input
              v-model="email"
              type="email"
              id="email"
              class="form-control"
              :class="{ 'is-invalid': emailError }"
              placeholder="Email"
            />
            <div v-if="emailError" class="invalid-feedback">
              {{ emailError }}
            </div>
          </div>

          <!-- LÖSENORD -->
          <div class="mb-3">
            <label for="password" class="form-label">Lösenord</label>
            <input
              v-model="password"
              type="password"
              id="password"
              class="form-control"
              :class="{ 'is-invalid': passwordError }"
              placeholder="Lösenord"
            />
            <div v-if="passwordError" class="invalid-feedback">
              {{ passwordError }}
            </div>
          </div>

          <button type="submit" class="btn btn-primary w-100">
            Logga in
          </button>

          <p v-if="error" class="text-danger mt-2 text-center">
            {{ error }}
          </p>
        </form>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { apiFetch } from '@/api/api';
import { setAuth } from '@/api/navAuth';

const email = ref('');
const password = ref('');
// Felmeddelande vid misslyckad inloggning, null om inget fel
const error = ref(null);

const emailError = ref(null);
const passwordError = ref(null);

// Router-instans för navigering efter inloggning
const router = useRouter();

const validate = () => {
  emailError.value = null;
  passwordError.value = null;

  let valid = true;

  if (!email.value) {
    emailError.value = 'Email är obligatoriskt';
    valid = false;
  } else if (!email.value.includes('@')) {
    emailError.value = 'Ogiltig emailadress';
    valid = false;
  }

  if (!password.value) {
    passwordError.value = 'Lösenord är obligatoriskt';
    valid = false;
  } else if (password.value.length < 6) {
    passwordError.value = 'Lösenord måste vara minst 6 tecken';
    valid = false;
  }
  return valid;
};

const login = async () => {
  error.value = null;

  if (!validate()) {
    return;
  }

  try {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: email.value,
        password: password.value
      })
    });
    
    // Spara token och roll i localStorage
    setAuth(data.token, data.user.role);

    // Navigera till startsidan efter inloggning, kanske ändrar sen.
    router.push('/');
  } catch (err) {
    // Felmeddelande från servern eller generiskt felmeddelande
    error.value = err?.error || 'Fel vid inloggning';
  }
};
</script>


<style scoped></style>