<template>
  <section v-if="show" class="confirm-overlay" role="alertdialog" aria-modal="true">
    <article class="confirm-box">
      <header class="confirm-header">
        <h2>{{ title }}</h2>
      </header>

      <p>{{ message }}</p>

      <footer class="confirm-actions">
        <button class="btn btn-outline-secondary" @click="$emit('cancel')">
          {{ cancelText }}
        </button>
        <button class="btn btn-danger" @click="$emit('confirm')">
          {{ confirmText }}
        </button>
      </footer>
    </article>
  </section>
</template>

<script setup>
defineProps({
  show: Boolean,
  title: { type: String, default: 'Bekräfta' },
  message: { type: String, required: true },
  confirmText: { type: String, default: 'Ja, ta bort' },
  cancelText: { type: String, default: 'Avbryt' }
});

defineEmits(['confirm', 'cancel']);
</script>

<style scoped>
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

/* Toast */
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

.toast-error {
  background: #dc3545;
  color: #fff;
}

.toast-warning {
  background: #ffc107;
  color: #212529;
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

