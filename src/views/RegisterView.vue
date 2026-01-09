<template>
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-4">
                <h1 class="text-center mb-4">Skapa konto</h1>

                <div class="modal fade show d-block" v-if="success">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Konto skapat</h5>
                            </div>
                            <div class="modal-body">
                                Ditt konto är nu skapat!
                            </div>
                            <div class="modal-footer">
                                <button class="btn btn-primary" @click="goToLogin">
                                    Logga in
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <form v-if="!success" @submit.prevent="register" class="card p-4 shadow">
                    <!-- NAMN -->
                    <div class="mb-3">
                        <label class="form-label">Namn</label>
                        <input v-model="name" class="form-control" :class="{ 'is-invalid': nameError }" />
                        <div v-if="nameError" class="invalid-feedback">
                            {{ nameError }}
                        </div>
                    </div>

                    <!-- EMAIL -->
                    <div class="mb-3">
                        <label class="form-label">Email</label>
                        <input v-model="email" type="email" class="form-control"
                            :class="{ 'is-invalid': emailError }" />
                        <div v-if="emailError" class="invalid-feedback">
                            {{ emailError }}
                        </div>
                    </div>

                    <!-- LÖSENORD -->
                    <div class="mb-3">
                        <label class="form-label">Lösenord</label>
                        <input v-model="password" type="password" class="form-control"
                            :class="{ 'is-invalid': passwordError }" />
                        <div v-if="passwordError" class="invalid-feedback">
                            {{ passwordError }}
                        </div>
                    </div>

                    <button class="btn btn-success w-100">
                        Skapa konto
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

const success = ref(false);
const router = useRouter();

const name = ref('');
const email = ref('');
const password = ref('');

const error = ref(null);
const nameError = ref(null);
const emailError = ref(null);
const passwordError = ref(null);

const validate = () => {
    nameError.value = null;
    emailError.value = null;
    passwordError.value = null;

    let valid = true;

    if (!name.value) {
        nameError.value = 'Namn är obligatoriskt';
        valid = false;
    }

    if (!email.value || !email.value.includes('@')) {
        emailError.value = 'Ogiltig email';
        valid = false;
    }

    if (!password.value || password.value.length < 6) {
        passwordError.value = 'Minst 6 tecken';
        valid = false;
    }

    return valid;
};

// Navigera till inloggningssidan
const goToLogin = () => {
    success.value = false;
    router.push('/login');
};

const register = async () => {
    error.value = null;
    if (!validate()) return;

    try {
        await apiFetch('/auth/register', {
            method: 'POST',
            body: JSON.stringify({
                name: name.value,
                email: email.value,
                password: password.value
            })
        });

        success.value = true;
    } catch (err) {
        error.value = err?.error || 'Kunde inte skapa konto';
    }
};
</script>
